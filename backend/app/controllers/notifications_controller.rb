class NotificationsController < ApplicationController
  before_action :set_user, only: [:index, :unread, :mark_all_read]
  before_action :set_notification, only: [:update, :destroy]

  def index
    @notifications = @user.notifications.order(created_at: :desc)
    render json: @notifications
  end

  def unread
    @notifications = @user.notifications.where(read: false).order(created_at: :desc)
    render json: @notifications
  end

  def update
    if @notification.update(read: true)
      render json: @notification
    else
      render json: { error: 'Failed to mark as read' }, status: :unprocessable_entity
    end
  end

  def mark_all_read
    if @user.notifications.update_all(read: true)
      render json: { message: "All notifications marked as read." }, status: :ok
    else
      render json: { error: "Failed to mark notifications as read." }, status: :unprocessable_entity
    end
  end

  # 🔥 NEW destroy method
  def destroy
    if @notification.destroy
      render json: { message: "Notification deleted successfully." }, status: :ok
    else
      render json: { error: "Failed to delete notification." }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:user_id])
  end

  def set_notification
    @notification = Notification.find(params[:id])
  end
end
