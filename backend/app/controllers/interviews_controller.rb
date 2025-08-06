class InterviewsController < ApplicationController
  # 🔐 Authenticate all actions in this controller to require a logged-in user
  before_action :authenticate_user!

  # 🔐 This filter sets the interview for show, update, destroy, and custom actions
  before_action :set_interview, only: [:show, :update, :destroy, :validate_interview_accept, :validate_interview_reject]

  # GET /interviews
  # 🔐 Requires authentication due to global before_action
  def index
    @interviews = Interview.includes(application: [:candidate, :job_offer], interviewer: {}).all

    render json: @interviews.as_json(
      include: {
        application: {
          include: {
            candidate: { only: [:id, :name] },
            job_offer: { only: [:id, :title, :location] }
          },
          only: [:id]
        },
        interviewer: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    )
  end

  # GET /interviews/:id
  # 🔐 Requires authentication
  def show
    render json: @interview.as_json(
      include: {
        application: {
          include: {
            candidate: { only: [:id, :name] },
            job_offer: { only: [:id, :title, :location] }
          },
          only: [:id]
        },
        interviewer: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    )
  end

  # GET /interviews/by_user/:user_id
  # 🔐 Requires authentication
  def by_user
    user_id = params[:user_id]

    @interviews = Interview.joins(application: :candidate)
                          .where(applications: { candidate_id: user_id })
                          .includes(application: [:candidate, :job_offer], interviewer: {})

    render json: @interviews.as_json(
      include: {
        application: {
          include: {
            candidate: { only: [:id, :name] },
            job_offer: { only: [:id, :title, :location] }
          },
          only: [:id]
        },
        interviewer: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    )
  end

  # POST /interviews
  # 🔐 Requires authentication
  def create
    @interview = Interview.new(interview_params)
    if @interview.save
      @interview.application.update(status: "Interviewed")

      # 🔔 Send notification to candidate
      Notification.create!(
        user: @interview.application.candidate,
        title: "New Interview Scheduled",
        message: "You have a new interview scheduled for the job '#{@interview.application.job_offer.title}' on #{@interview.interview_date}.",
        read: false
      )

      render json: @interview, status: :created
    else
      render json: @interview.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /interviews/:id
  # 🔐 Requires authentication
  def update
    old_date = @interview.interview_date

    if @interview.update(interview_params)
      # 🔔 Notify only if interview date was changed
      if @interview.interview_date != old_date
        Notification.create!(
          user: @interview.application.candidate,
          title: "Interview Rescheduled",
          message: "Your interview for the job '#{@interview.application.job_offer.title}' has been rescheduled to #{@interview.interview_date}.",
          read: false
        )
      end

      render json: @interview
    else
      render json: @interview.errors, status: :unprocessable_entity
    end
  end

  # DELETE /interviews/:id
  # 🔐 Requires authentication
  def destroy
    candidate = @interview.application.candidate
    job_title = @interview.application.job_offer.title
    application = @interview.application

    application.update(status: "Pending")
    @interview.destroy

    # 🔔 Notify candidate of cancellation
    Notification.create!(
      user: candidate,
      title: "Interview Cancelled",
      message: "Your interview for the job '#{job_title}' has been cancelled.",
      read: false
    )

    head :no_content
  end

  # PUT /interviews/:id/accept
  # 🔐 Requires authentication
  def validate_interview_accept
    application = @interview.application
    candidate = application.candidate

    ActiveRecord::Base.transaction do
      @interview.update!(status: "Finished", result: "Accepted")
      application.update!(status: "Accepted")

      Notification.create!(
        user: candidate,
        title: "Interview Accepted",
        message: "Congratulations! Your interview for the job '#{application.job_offer.title}' has been accepted.",
        read: false
      )

      InterviewMailer.interview_accepted(candidate, @interview, application).deliver_later
    end

    render json: {
      message: "Interview validated successfully",
      interview: @interview,
      application: application
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Interview not found" }, status: :not_found
  rescue => e
    render json: { error: "Failed to validate interview: #{e.message}" }, status: :unprocessable_entity
  end

  # PUT /interviews/:id/reject
  # 🔐 Requires authentication
  def validate_interview_reject
    application = @interview.application
    candidate = application.candidate

    ActiveRecord::Base.transaction do
      @interview.update!(status: "Finished", result: "Rejected")
      application.update!(status: "Rejected")

      Notification.create!(
        user: candidate,
        title: "Interview Rejected",
        message: "Unfortunately, your interview for the job '#{application.job_offer.title}' has been rejected.",
        read: false
      )

      InterviewMailer.interview_rejected(candidate, @interview, application).deliver_later
    end

    render json: {
      message: "Interview rejected successfully",
      interview: @interview,
      application: application
    }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Interview not found" }, status: :not_found
  rescue => e
    render json: { error: "Failed to reject interview: #{e.message}" }, status: :unprocessable_entity
  end

  private

  # 🔐 Set interview before certain actions
  def set_interview
    @interview = Interview.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Interview not found' }, status: :not_found
  end

  # 🔐 Strong params
  def interview_params
    params.require(:interview).permit(
      :application_id,
      :interview_date,
      :interviewer_id,
      :link,
      :status,
      :result,
      :duration,
      :notes
    )
  end
end
