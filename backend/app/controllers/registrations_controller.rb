class RegistrationsController < Devise::RegistrationsController
  respond_to :json


  # Override the create method
  def create
    assign_default_image_if_blank
    super
  end

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


  def assign_default_image_if_blank
    return if params[:user][:image].present?
    params[:user][:image] = 'uploads/default.jpg'
  end
  
  def respond_with(resource, _opts = {})
    Rails.logger.debug "User errors: #{resource.errors.full_messages}"
    if resource.persisted?
      notify_admins_of_new_user(resource)
      render json: { message: 'Signed up successfully.', user: resource }, status: :ok
    else
      render json: { message: 'Sign up failed.', errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end


  def notify_admins_of_new_user(new_user)
    admins = User.where(role: 0) # Adjust this if your role value is different

    admins.each do |admin|
      Notification.create!(
        user: admin,
        title: 'New User Registered',
        message: "A new user named #{new_user.name} (#{new_user.email}) has just registered.",
        read: false
      )
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