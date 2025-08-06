class ProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_profile, only: [:show, :update, :destroy]

  # GET /profiles
  def index
    @profiles = Profile.all

    render json: @profiles.as_json(include: {
      user: { only: [:name, :email, :image] }
    })
  end

  # GET /profiles/:id
  def show
    render json: @profile.as_json(include: {
        user: { only: [:name, :email, :image] }
    })
  end

  # POST /profiles
  def create
    @profile = Profile.new(profile_params)
    @profile.user = current_user

    if @profile.save
      render json: @profile.as_json(include: {
        user: { only: [:name, :email, :image] }
      }), status: :created
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /profiles/:id
  def update
    if @profile.update(profile_params)
      render json: @profile.as_json(include: {
        user: { only: [:name, :email, :image] }
      })
    else
      render json: @profile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /profiles/:id
  def destroy
    @profile.destroy
    head :no_content
  end

  private

  def set_profile
    @profile = Profile.find(params[:id])

    # Allow if it's the current user's profile or if the user has a special role
    unless @profile.user == current_user || current_user.admin? || current_user.rh?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Profile not found' }, status: :not_found
  end

  def profile_params
    params.require(:profile).permit(
      :name,
      :email,
      :phone,
      :cv_file,
      skills: [],
      experience: [],
      education: []
    )
  end
end
