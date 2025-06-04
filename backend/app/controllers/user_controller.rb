class UserController < ApplicationController
    #before_action :authenticate_user!  # Optional, if you want to authenticate the user

    def index
        @users = User.all  # Get all users from the database
        render json: @users  # Respond with users in JSON format
    end

    def hr_users
        hr_users = User.where(role: 1)
        render json: hr_users
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
      
          timestamp = Time.now.strftime('%Y%m%d%H%M%S')
          extension = File.extname(uploaded_image.original_filename)
          new_image_name = "Image_#{@user.name}_#{@user.id}_#{timestamp}#{extension}"

          # Define the path relative to the Angular frontend's public/uploads directory
          frontend_upload_path = Rails.root.join('..', 'frontend', 'public', 'uploads', new_image_name)
      
          # Save the uploaded file to the frontend/public/uploads directory
          File.open(frontend_upload_path, 'wb') do |file|
            file.write(uploaded_image.read) # Save the content of the uploaded file
          end
      
          # Store the relative path to the image in the database (e.g., "uploads/filename.png")
          @user.image = "uploads/#{new_image_name}"
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
        # Save user info before deletion for the notification
        deleted_user_name = @user.name
        deleted_user_email = @user.email

        # Store image path unless it's the default image
        image_file_path = nil
        if @user.image.present? && @user.image != 'uploads/default.jpg'
          image_file_path = Rails.root.join('..', 'frontend', 'public', @user.image)
        end

        @user.destroy
        # Delete the Image file if it exists
        if image_file_path && File.exist?(image_file_path)
          File.delete(image_file_path)
        end

        # Notify all admins about the deleted user account
        notify_admins_of_deletion(deleted_user_name, deleted_user_email)

        render json: { message: 'User deleted successfully' }, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end


    def update_password
      user = User.find_by(id: params[:id])
      if user && user.update(password: params[:password])
        user.increment!(:nbCnx) if user.nbCnx == 1
        render json: { message: 'Password updated successfully.' }, status: :ok
      else
        render json: { errors: user ? user.errors.full_messages : ['User not found'] }, status: :unprocessable_entity
      end
    end

    private

    def notify_admins_of_deletion(name, email)
      admin_users = User.where(role: 0)  # Adjust role value according to your app's conventions
      admin_users.each do |admin|
        Notification.create!(
          user: admin,
          title: 'User Account Deleted',
          message: "User #{name} (#{email}) has deleted their account.",
          read: false
        )
      end
    end

    def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :gender, :birth_date, :nationality)
    end
end
