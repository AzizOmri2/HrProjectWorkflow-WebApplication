class NotificationsController < ApplicationController
  # Ensure the user is authenticated before accessing any action
  before_action :authenticate_user!

  # Set the user from the params for actions that need it
  before_action :set_user, only: [:index, :unread, :mark_all_read]

  # Set the notification for actions that modify a specific notification
  before_action :set_notification, only: [:update, :destroy]

  # GET /users/:user_id/notifications
  # Returns all notifications for a specific user, ordered by most recent
  def index
    @notifications = @user.notifications.order(created_at: :desc)
    render json: @notifications
  end

  # GET /users/:user_id/notifications/unread
  # Returns only unread notifications for a user
  def unread
    @notifications = @user.notifications.where(read: false).order(created_at: :desc)
    render json: @notifications
  end

  # PATCH/PUT /notifications/:id
  # Marks a specific notification as read
  def update
    if @notification.update(read: true)
      render json: @notification
    else
      render json: { error: 'Failed to mark as read' }, status: :unprocessable_entity
    end
  end

  # PATCH /users/:user_id/notifications/mark_all_read
  # Marks all notifications for a user as read
  def mark_all_read
    if @user.notifications.update_all(read: true)
      render json: { message: "All notifications marked as read." }, status: :ok
    else
      render json: { error: "Failed to mark notifications as read." }, status: :unprocessable_entity
    end
  end

  # DELETE /notifications/:id
  # Deletes a specific notification
  def destroy
    if @notification.destroy
      render json: { message: "Notification deleted successfully." }, status: :ok
    else
      render json: { error: "Failed to delete notification." }, status: :unprocessable_entity
    end
  end

  private

  # Finds the user based on the user_id from params
  def set_user
    @user = User.find(params[:user_id])
  end

  # Finds the notification based on the id from params
  def set_notification
    @notification = Notification.find(params[:id])
  end
end
