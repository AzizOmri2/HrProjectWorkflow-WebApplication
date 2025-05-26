class ApplicationsController < ApplicationController
  before_action :set_application, only: [:show, :update, :destroy, :withdraw]

  # GET /applications
  def index
    applications = Application.includes(:job_offer, :candidate).all
    render json: applications.as_json(include: {
      job_offer: { only: [:title, :company] },
      candidate: { only: [:name] }
    })
  end

  # GET /applications/:id
  def show
    render json: @application.as_json(include: {
      job_offer: { only: [:title, :company] },
      candidate: { only: [:name] }
    })
  end

  # POST /applications
  def create
    # Debugging to check what parameters are received
    Rails.logger.debug("Received Parameters: #{params.inspect}")

    existing_application = Application.find_by(
      job_offer_id: application_params[:job_offer_id],
      candidate_id: application_params[:candidate_id]
    )

    if existing_application
      render json: { error: 'You have already applied to this job offer.' }, status: :unprocessable_entity
    else
      application = Application.new(application_params.except(:cv_file))

      # Handle file upload
      if params[:application][:cv_file].present?
        uploaded_cv = params[:application][:cv_file]

        # Rename the file to "Cv_JohnDoe_5_20250514113500.pdf"
        timestamp = Time.now.strftime('%Y%m%d%H%M%S')
        new_filename = "Cv_#{application.candidate.name}_#{application.candidate_id}_#{timestamp}.pdf"

        # Save the file to the frontend/public/cv_resources directory
        cv_upload_path = Rails.root.join('..', 'frontend', 'public', 'cv_resources', new_filename)
        File.open(cv_upload_path, 'wb') do |file|
          file.write(uploaded_cv.read)
        end

        # Save relative path in DB
        application.cv_file = "cv_resources/#{new_filename}"
      end

      if application.save
        # Notify HR
        offer_title = application.job_offer.title rescue "a job offer"
        candidate_name = application.candidate.name rescue "a candidate"
        notify_hr(application, "New Application Received", "#{candidate_name} has applied for '#{offer_title}'.")

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
    # Update attributes except cv_file
    if @application.update(application_params.except(:cv_file))
      
      # Handle file upload if a new CV is provided
      if params[:application][:cv_file].present?
        uploaded_cv = params[:application][:cv_file]
  
        # Build new filename using candidate info
        candidate = @application.candidate
        timestamp = Time.now.strftime('%Y%m%d%H%M%S')
        new_filename = "Cv_#{candidate.name}_#{candidate.id}_#{timestamp}.pdf"
  
        # Save the file to the frontend/public/cv_resources directory
        cv_upload_path = Rails.root.join('..', 'frontend', 'public', 'cv_resources', new_filename)
        File.open(cv_upload_path, 'wb') do |file|
          file.write(uploaded_cv.read)
        end
  
        # Update the cv_file path in DB
        @application.update(cv_file: "cv_resources/#{new_filename}")
      end
  
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
    # Store CV file path before destroying
    cv_file_path = Rails.root.join('..', 'frontend', 'public', @application.cv_file) if @application.cv_file.present?

    if @application.destroy
      # Delete the CV file if it exists
      if cv_file_path && File.exist?(cv_file_path)
        File.delete(cv_file_path)
      end

      render json: { message: 'Application and associated CV deleted successfully' }, status: :ok
    else
      render json: { error: 'Failed to delete application' }, status: :unprocessable_entity
    end
  end

  # PUT /applications/:id/withdraw
  def withdraw
    if @application.update(status: 'Withdrawn')
      notify_hr(@application, "Application Withdrawn", "Candidate #{@application.candidate.name} has withdrawn their application for '#{@application.job_offer.title}'.")
      render json: @application, status: :ok
    else
      render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /applications/by_candidate/:id
  def by_candidate
    applications = Application.includes(:job_offer, :candidate).where(candidate_id: params[:id])
    render json: applications.as_json(include: {
      job_offer: { only: [:title, :company] },
      candidate: { only: [:name] }
    })
  end

  # GET /applications/by_offer/:id
  def by_offer
    applications = Application.includes(:job_offer, :candidate).where(job_offer_id: params[:id])
    render json: applications.as_json(include: {
      job_offer: { only: [:title, :company] },
      candidate: { only: [:name] }
    })
  end

  # GET /applications/:id/download_pdf
  def download_pdf
    # Assuming the CV filename is saved in the `cv_file` attribute
    application = Application.find(params[:id])

    if application && application.cv_file.present?
      cv_file_path = Rails.root.join('..', 'frontend', 'public', application.cv_file)

      if File.exist?(cv_file_path)
        send_file cv_file_path, filename: File.basename(cv_file_path), type: 'application/pdf', disposition: 'attachment'
      else
        render json: { error: 'File not found' }, status: :not_found
      end
    else
      render json: { error: 'Application or file not found' }, status: :not_found
    end
  end

  private

  def set_application
    @application = Application.includes(:job_offer, :candidate).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Application not found' }, status: :not_found
  end

  def notify_hr(application, title, message)
    # Fetch all users with HR role
    hr_users = User.where(role: 1)
    
    hr_users.each do |hr|
      Notification.create!(
        user: hr,
        title: title,
        message: message,
        read: false
      )
    end
  end

  def application_params
    params.require(:application).permit(:job_offer_id, :candidate_id, :cv_file, :status, :applied_at)
  end
end
