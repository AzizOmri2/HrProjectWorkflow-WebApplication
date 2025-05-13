class UserController < ApplicationController
    #before_action :authenticate_user!  # Optional, if you want to authenticate the user

    def index
        @users = User.all  # Get all users from the database
        render json: @users  # Respond with users in JSON format
    end

    def show
        user = User.find_by(id: params[:id])
        if user
          render json: user
        else
          render json: { error: "User not found" }, status: :not_found
        end
    end

    def update
        @user = User.find(params[:id])
      
        # Check if an image is uploaded
        if params[:user][:image].present?
          uploaded_image = params[:user][:image] # Get the uploaded file
      
          # Define the path relative to the Angular frontend's public/uploads directory
          frontend_upload_path = Rails.root.join('..', 'frontend', 'public', 'uploads', uploaded_image.original_filename)
      
          # Save the uploaded file to the frontend/public/uploads directory
          File.open(frontend_upload_path, 'wb') do |file|
            file.write(uploaded_image.read) # Save the content of the uploaded file
          end
      
          # Store the relative path to the image in the database (e.g., "uploads/filename.png")
          @user.image = "uploads/#{uploaded_image.original_filename}"
        end
      
        # Update the user record with the new or existing image path
        if @user.update(user_params)
          render json: @user, status: :ok
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
    end

    def toggle_active
        @user = User.find(params[:id])
    
        # Toggle active status
        @user.active = !@user.active
        if @user.save
          render json: { status: 'success', message: 'User active status updated', user: @user }
        else
          render json: { status: 'error', message: 'Failed to update active status' }
        end
    end

    def destroy
      @user = User.find_by(id: params[:id])
      if @user
        @user.destroy
        render json: { message: 'User deleted successfully' }, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
