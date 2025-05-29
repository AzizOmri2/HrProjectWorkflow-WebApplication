class PasswordsController < Devise::PasswordsController
  respond_to :json

  # Override create to respond with JSON
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)

    yield resource if block_given?

    if successfully_sent?(resource)
      render json: { message: "Reset password instructions sent" }, status: :ok
    else
      render json: { error: resource.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  def update
    self.resource = resource_class.reset_password_by_token(resource_params)
    yield resource if block_given?

    if resource.errors.empty?
      # Do NOT sign in the user
      render json: { message: "Password updated successfully." }, status: :ok
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end