class ProtectedController < ApplicationController
  before_action :authenticate_api_v1_user!

  def index
    render json: { message: 'This is a protected endpoint.', user: current_api_v1_user }
  end
end