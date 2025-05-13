class ApplicationsController < ApplicationController
  before_action :set_application, only: [:show, :update, :destroy]

  # GET /applications
  def index
    applications = Application.includes(:job_offer, :candidate).all
    render json: applications.as_json(include: {
      job_offer: { only: [:title] },
      candidate: { only: [:name] }
    })
  end

  # GET /applications/:id
  def show
    render json: @application.as_json(include: {
      job_offer: { only: [:title] },
      candidate: { only: [:name] }
    })
  end

  # POST /applications
  def create
    existing_application = Application.find_by(
      job_offer_id: application_params[:job_offer_id],
      candidate_id: application_params[:candidate_id]
    )

    if existing_application
      render json: { error: 'You have already applied to this job offer.' }, status: :unprocessable_entity
    else
      application = Application.new(application_params)
      if application.save
        render json: application.as_json(include: {
          job_offer: { only: [:title] },
          candidate: { only: [:name] }
        }), status: :created
      else
        render json: { errors: application.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end

  # PUT/PATCH /applications/:id
  def update
    if @application.update(application_params)
      render json: @application.as_json(include: {
        job_offer: { only: [:title] },
        candidate: { only: [:name] }
      })
    else
      render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /applications/:id
  def destroy
    @application.destroy
    render json: { message: 'Application deleted successfully' }, status: :ok
  end

  # GET /applications/by_candidate/:id
  def by_candidate
    applications = Application.includes(:job_offer, :candidate).where(candidate_id: params[:id])
    render json: applications.as_json(include: {
      job_offer: { only: [:title] },
      candidate: { only: [:name] }
    })
  end

  # GET /applications/by_offer/:id
  def by_offer
    applications = Application.includes(:job_offer, :candidate).where(job_offer_id: params[:id])
    render json: applications.as_json(include: {
      job_offer: { only: [:title] },
      candidate: { only: [:name] }
    })
  end

  private

  def set_application
    @application = Application.includes(:job_offer, :candidate).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Application not found' }, status: :not_found
  end

  def application_params
    params.require(:application).permit(:job_offer_id, :candidate_id, :cv_file, :status, :applied_at)
  end
end
