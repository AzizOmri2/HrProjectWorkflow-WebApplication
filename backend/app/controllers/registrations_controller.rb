class RegistrationsController < Devise::RegistrationsController
  respond_to :json

  protected

  # Override to prevent session storage
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource, store: false)
  end

  # Permit user parameters
  def sign_up_params
    Rails.logger.debug "Raw params: #{params.inspect}"
    permitted = params.require(:user).permit(:name, :email, :password, :password_confirmation, :role, :image, :active)
    Rails.logger.debug "Permitted params: #{permitted.inspect}"
    permitted
  end

  private

  def respond_with(resource, _opts = {})
    Rails.logger.debug "User errors: #{resource.errors.full_messages}"
    if resource.persisted?
      render json: { message: 'Signed up successfully.', user: resource }, status: :ok
    else
      render json: { message: 'Sign up failed.', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Handle database unique constraint errors
  rescue_from ActiveRecord::RecordNotUnique do |exception|
    if exception.message.include?('index_users_on_email')
      render json: { message: 'Sign up failed.', errors: ['Email has already been taken'] }, status: :unprocessable_entity
    else
      render json: { message: 'Sign up failed.', errors: ['Database error occurred'] }, status: :unprocessable_entity
    end
  end
end