class UserController < ApplicationController
    before_action :authenticate_user!

    # ===================================================
    # GET /users
    # ===================================================
    # Retrieves all users from the database and returns them in JSON format.
    def index
        @users = User.all  # Get all users from the database
        render json: @users  # Respond with users in JSON format
    end

    # ===================================================
    # GET /users/hr_users
    # ===================================================
    # Retrieves all users with role = 1 (HR users) and returns them in JSON format.
    def hr_users
        hr_users = User.where(role: 1)
        render json: hr_users
    end

    # ===================================================
    # GET /users/:id
    # ===================================================
    # Finds a user by ID and returns user data in JSON format.
    # If user is not found, returns a 404 status with an error message.
    def show
        user = User.find_by(id: params[:id])
        if user
          render json: user
        else
          render json: { error: "User not found" }, status: :not_found
        end
    end

    # ===================================================
    # POST /users/admin
    # ===================================================
    # Creates a new user with provided parameters.
    # Assigns a default image if none is provided.
    # Returns success message and user data if creation is successful,
    # otherwise returns errors with unprocessable_entity status.
    def create
      assign_default_image_if_blank

      @user = User.new(user_params)

      if @user.save
        render json: { message: 'User created successfully.', user: @user }, status: :ok
      else
        render json: { message: 'User creation failed.', errors: @user.errors.full_messages }, status: :unprocessable_entity
      end
    end


    # ===================================================
    # PATCH/PUT /users/:id/update
    # ===================================================
    # Updates an existing user's attributes.
    # Handles image upload: saves new image to public/uploads/profile_pictures and updates image path.
    # Returns updated user data on success, otherwise returns errors.
    def update
        @user = User.find(params[:id])
      
        # Check if an image is uploaded
        if params[:user][:image].present?
          uploaded_image = params[:user][:image] # Get the uploaded file
      
          timestamp = Time.now.strftime('%Y%m%d%H%M%S')
          extension = File.extname(uploaded_image.original_filename)
          new_image_name = "Image_#{@user.name}_#{@user.id}_#{timestamp}#{extension}"

          # Define the path relative to the Ruby On Rails backend's public/uploads/profile_pictures directory
          frontend_upload_path = Rails.root.join('public', 'uploads', 'profile_pictures', new_image_name)
      
          # Save the uploaded file to the backend/public/uploads/profile_pictures directory
          File.open(frontend_upload_path, 'wb') do |file|
            file.write(uploaded_image.read) # Save the content of the uploaded file
          end
      
          # Store the relative path to the image in the database (e.g., "uploads/profile_pictures/filename.png")
          @user.image = "uploads/profile_pictures/#{new_image_name}"
        end
      
        # Update the user record with the new or existing image path
        if @user.update(user_params.except(:image))
          render json: @user, status: :ok
        else
          render json: { errors: @user.errors }, status: :unprocessable_entity
        end
    end

    # ===================================================
    # POST /users/:id/toggle_active
    # ===================================================
    # Toggles the active status of a user between true and false.
    # Returns success message with updated user data or error message on failure.
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

    # ===================================================
    # DELETE /users/:id
    # ===================================================
    # Deletes a user by ID.
    # Removes the user's profile image file if it exists and is not the default.
    # Returns success or error messages depending on whether the user was found and deleted.
    def destroy
      @user = User.find_by(id: params[:id])

      if @user
        # Store image path unless it's the default image
        image_file_path = nil
        if @user.image.present? && @user.image != 'uploads/profile_pictures/default.jpg'
          image_file_path = Rails.root.join('public', @user.image)
        end

        @user.destroy

        # Delete the Image file if it exists
        if image_file_path && File.exist?(image_file_path)
          File.delete(image_file_path)
        end

        render json: { message: 'User deleted successfully' }, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end

    # ===================================================
    # PATCH /users/:id/update_password
    # ===================================================
    # Updates the password for a user specified by ID.
    # If update is successful and user's nbCnx equals 1, increments nbCnx.
    # Returns success or error messages accordingly.
    def update_password
      user = User.find_by(id: params[:id])
      if user && user.update(password: params[:password])
        user.increment!(:nbCnx) if user.nbCnx == 1
        render json: { message: 'Password updated successfully.' }, status: :ok
      else
        render json: { errors: user ? user.errors.full_messages : ['User not found'] }, status: :unprocessable_entity
      end
    end

    # ===================================================
    # POST /users/verify_password
    # ===================================================
    # Verify the users password in case of locking screen.
    # Returns success or error messages accordingly.
    def verify_password
      user = current_user

      if user.nil?
        # User not found or not logged in
        render json: { success: false, message: "User not authenticated." }, status: :unauthorized
        return
      end

      if user.valid_password?(params[:password])
        render json: { success: true, message: "Password is correct." }
      else
        render json: { success: false, message: "Password is incorrect." }
      end
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
    # Strong parameters for user creation and update
    # ===================================================
    # Permits only allowed attributes from the params hash
    def user_params
        params.require(:user).permit(
          :name, :email, :password, :password_confirmation, :gender, :birth_date, :nationality, :role, :image, :active)
    end
end
