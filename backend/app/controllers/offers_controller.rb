class OffersController < ApplicationController
  before_action :set_offer, only: [:show, :update, :destroy]

  # GET /offers
  def index
    Offer.expire_old_offers
    
    @offers = Offer.all
    render json: @offers
  end

  # GET /offers/:id
  def show
    Offer.expire_old_offers
    render json: @offer
  end

  # POST /offers
  def create
    @offer = Offer.new(offer_params)
    if @offer.save
      notify_candidates(@offer)
      render json: @offer, status: :created
    else
      render json: { errors: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /offers/:id
  def update
    if @offer.update(offer_params)
      render json: @offer
    else
      render json: { errors: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /offers/:id
  def destroy
    @offer.destroy
    head :no_content
  end

  private

  def set_offer
    @offer = Offer.find_by(id: params[:id])
    render json: { error: "Offer not found" }, status: :not_found unless @offer
  end

  def notify_candidates(offer)
    candidates = User.where(role: 2)
    candidates.find_each do |candidate|
      Notification.create!(
        user: candidate,
        title: "New Job Offer Posted",
        message: "A new job offer '#{offer.title}' has just been posted. Check it out!",
        read: false
      )
    end
  end

  def offer_params
    params.require(:offer).permit(
      :title,
      :department,
      :skills_required,
      :experience_level,
      :deadline,
      :status,
      :created_by_id,
      :description,
      :company,
      :location
    )
  end
end
