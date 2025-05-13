class InterviewsController < ApplicationController
  before_action :set_interview, only: [:show, :update, :destroy]

  # GET /interviews
  def index
    @interviews = Interview.includes(application: [:candidate, :job_offer], interviewer: {}).all

    render json: @interviews.as_json(
      include: {
        application: {
          include: {
            candidate: { only: [:id, :name] },
            job_offer: { only: [:id, :title] }
          },
          only: [:id]
        },
        interviewer: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    )
  end

  # GET /interviews/:id
  def show
    render json: @interview.as_json(
      include: {
        application: {
          include: {
            candidate: { only: [:id, :name] },
            job_offer: { only: [:id, :title] }
          },
          only: [:id]
        },
        interviewer: { only: [:id, :name] }
      },
      except: [:created_at, :updated_at]
    )
  end

  # POST /interviews
  def create
    @interview = Interview.new(interview_params)
    if @interview.save
      render json: @interview, status: :created
    else
      render json: @interview.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /interviews/:id
  def update
    if @interview.update(interview_params)
      render json: @interview
    else
      render json: @interview.errors, status: :unprocessable_entity
    end
  end

  # DELETE /interviews/:id
  def destroy
    @interview.destroy
    head :no_content
  end


  # PUT /interviews/:id/accept
  def validate_interview_accept
    @interview = Interview.find(params[:id])
    application = @interview.application

    ActiveRecord::Base.transaction do
      @interview.update!(status: "Finished", result: "Accepted")
      application.update!(status: "Accepted")
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
  def validate_interview_reject
    @interview = Interview.find(params[:id])
    application = @interview.application

    ActiveRecord::Base.transaction do
      @interview.update!(status: "Finished", result: "Rejected")
      application.update!(status: "Rejected")
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


  private

  def set_interview
    @interview = Interview.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Interview not found' }, status: :not_found
  end

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
