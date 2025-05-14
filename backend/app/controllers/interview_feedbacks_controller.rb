class InterviewFeedbacksController < ApplicationController
  before_action :set_interview_feedback, only: [:show, :update, :destroy]

  # GET /interview_feedbacks
  def index
    @interview_feedbacks = InterviewFeedback.all
    render json: @interview_feedbacks
  end

  # GET /interview_feedbacks/:id
  def show
    render json: @interview_feedbacks
  end

  def create
    @interview_feedback = InterviewFeedback.new(interview_feedback_params)
    if @interview_feedback.save
      render json: @interview_feedback, status: :created
    else
      render json: @interview_feedback.errors, status: :unprocessable_entity
    end
  end

  def update
    if @interview_feedback.update(interview_feedback_params)
      render json: @interview_feedback
    else
      render json: @interview_feedback.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @interview_feedback.destroy
  end

  def get_feedbacks_by_interview_id
    # Fetch feedbacks for the given interview_id
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
            username: feedback.user&.name # Safely fetch username
        }
        end

        render json: feedbacks_with_user, status: :ok
    else
      render json: { message: 'No feedbacks found for this interview' }, status: :not_found
    end
  end

  private

  def set_interview_feedback
    @interview_feedback = InterviewFeedback.find(params[:id])
  end

  def interview_feedback_params
    params.require(:interview_feedback).permit(:interview_id, :user_id, :feedback, :rating)
  end
end
