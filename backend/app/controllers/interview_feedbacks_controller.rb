class InterviewFeedbacksController < ApplicationController
  before_action :set_interview_feedback, only: [:show, :update, :destroy]
  before_action :authenticate_user!

  # GET /interview_feedbacks
  def index
    @interview_feedbacks = InterviewFeedback.all
    render json: @interview_feedbacks
  end

  # GET /interview_feedbacks/:id
  def show
    render json: @interview_feedback
  end

  # POST /interview_feedbacks
  def create
    @interview_feedback = InterviewFeedback.new(interview_feedback_params)

    if @interview_feedback.save
      # === Notification Logic ===
      # 1. Fetch the related interview, candidate and job offer
      interview = @interview_feedback.interview
      application = interview.application if interview
      candidate = application&.candidate
      job_offer = application&.job_offer

      # 2. Extract candidate name and job title for message context
      candidate_name = candidate&.name || "A candidate"
      job_offer_title = job_offer&.title || "a job offer"

      # 3. Fetch all HR users except the one who added the feedback
      hr_users = User.where(role: 1).where.not(id: @interview_feedback.user_id)

      # 4. Create a notification for each eligible HR member
      hr_users.each do |hr_user|
        Notification.create!(
          user: hr_user,
          title: "New Interview Feedback",
          message: "#{@interview_feedback.user.name} added feedback for #{candidate_name} on #{job_offer_title}.",
          read: false
        )
      end
      # === End Notification Logic ===

      render json: @interview_feedback, status: :created
    else
      render json: @interview_feedback.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /interview_feedbacks/:id
  def update
    if @interview_feedback.update(interview_feedback_params)
      render json: @interview_feedback
    else
      render json: @interview_feedback.errors, status: :unprocessable_entity
    end
  end

  # DELETE /interview_feedbacks/:id
  def destroy
    if @interview_feedback.destroy
      head :no_content
    else
      render json: { error: 'Failed to delete feedback' }, status: :unprocessable_entity
    end
  end

  # GET /interview_feedbacks/by_interview/:interview_id
  def get_feedbacks_by_interview_id
    @interview_feedbacks = InterviewFeedback.includes(:user).where(interview_id: params[:interview_id])
    
    if @interview_feedbacks.any?
      feedbacks_with_user = @interview_feedbacks.map do |feedback|
        {
          id: feedback.id,
          interview_id: feedback.interview_id,
          user_id: feedback.user_id,
          feedback: feedback.feedback,
          rating: feedback.rating,
          created_at: feedback.created_at,
          updated_at: feedback.updated_at,
          username: feedback.user&.name
        }
      end

      render json: feedbacks_with_user, status: :ok
    else
      render json: { message: 'No feedbacks found for this interview' }, status: :not_found
    end
  end

  private

  # Set feedback instance by ID
  def set_interview_feedback
    @interview_feedback = InterviewFeedback.find(params[:id])
  end

  # Strong parameters for feedback creation/update
  def interview_feedback_params
    params.require(:interview_feedback).permit(:interview_id, :user_id, :feedback, :rating)
  end
end
