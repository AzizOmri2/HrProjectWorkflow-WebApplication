class RegistrationsController < Devise::RegistrationsController
  respond_to :json


  # ===================================================
  # POST /users (Override Devise registration create)
  # ===================================================
  # Creates a new user registration.
  # Assigns a default image if none provided before invoking Devise's create.
  def create
    assign_default_image_if_blank
    super
  end

  protected

  # ===================================================
  # Override sign_up to prevent storing the session
  # ===================================================
  # Signs in the user without storing session (API-friendly)
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource, store: false)
  end

  # ===================================================
  # Strong params for user sign up
  # ===================================================
  # Permits required and optional parameters for user registration
  def sign_up_params
    Rails.logger.debug "Raw params: #{params.inspect}"
    permitted = params.require(:user).permit(:name, :email, :password, :password_confirmation, :role, :image, :active)
    Rails.logger.debug "Permitted params: #{permitted.inspect}"
    permitted
  end

  private

  # ===================================================
  # Assign default image to user if none provided
  # ===================================================
  # Sets a default profile image path if the 'image' param is blank or missing
  def assign_default_image_if_blank
    return if params[:user][:image].present?
    params[:user][:image] = 'uploads/profile_pictures/default.jpg'
  end
  
  # ===================================================
  # Respond with success or error JSON after registration
  # ===================================================
  # Overridden to customize JSON response for API usage
  def respond_with(resource, _opts = {})
    Rails.logger.debug "User errors: #{resource.errors.full_messages}"
    if resource.persisted?
      render json: { message: 'Signed up successfully.', user: resource }, status: :ok
    else
      render json: { message: 'Sign up failed.', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # ===================================================
  # Handle unique email database constraint error gracefully
  # ===================================================
  rescue_from ActiveRecord::RecordNotUnique do |exception|
    if exception.message.include?('index_users_on_email')
      render json: { message: 'Sign up failed.', errors: ['Email has already been taken'] }, status: :unprocessable_entity
    else
      render json: { message: 'Sign up failed.', errors: ['Database error occurred'] }, status: :unprocessable_entity
    end
  end
end