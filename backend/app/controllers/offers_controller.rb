class OffersController < ApplicationController
  # 🔒 Authenticate user for all actions except viewing offers
  before_action :authenticate_user!, except: [:index, :show]

  # 🔎 Find offer by ID before executing show, update, or destroy actions
  before_action :set_offer, only: [:show, :update, :destroy]

  # ========================
  # 📄 GET /offers
  # ========================
  # Returns a list of all job offers.
  # Automatically expires outdated offers before listing.
  def index
    Offer.expire_old_offers  # 🔁 Auto-expire outdated offers
    @offers = Offer.all
    render json: @offers
  end

  # ========================
  # 📄 GET /offers/:id
  # ========================
  # Returns a specific offer by ID.
  # Also expires outdated offers before showing.
  def show
    Offer.expire_old_offers  # 🔁 Auto-expire outdated offers
    render json: @offer
  end

  # ========================
  # 🆕 POST /offers
  # ========================
  # Creates a new job offer.
  # Notifies all candidates upon successful creation.
  def create
    @offer = Offer.new(offer_params)
    if @offer.save
      notify_candidates(@offer)  # 🔔 Notify candidates of new job offer
      render json: @offer, status: :created
    else
      render json: { errors: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ========================
  # 🔄 PATCH/PUT /offers/:id
  # ========================
  # Updates an existing job offer.
  def update
    if @offer.update(offer_params)
      render json: @offer
    else
      render json: { errors: @offer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # ========================
  # ❌ DELETE /offers/:id
  # ========================
  # Deletes a specific offer by ID.
  def destroy
    @offer.destroy
    head :no_content  # ✅ Return HTTP 204 No Content
  end

  private

  # ========================
  # 🔍 Set @offer
  # ========================
  # Finds the offer by ID or returns a 404 error.
  def set_offer
    @offer = Offer.find_by(id: params[:id])
    render json: { error: "Offer not found" }, status: :not_found unless @offer
  end

  # ========================
  # 🔔 notify_candidates
  # ========================
  # Sends a notification to all users with the role 'CANDIDATE' (role = 2)
  # informing them that a new job offer has been posted.
  def notify_candidates(offer)
    candidates = User.where(role: 2)  # 🎯 Filter candidates
    candidates.find_each do |candidate|
      Notification.create!(
        user: candidate,
        title: "New Job Offer Posted",
        message: "A new job offer '#{offer.title}' has just been posted. Check it out!",
        read: false
      )
    end
  end

  # ========================
  # 📦 offer_params
  # ========================
  # Strong parameters - permits only allowed fields for mass assignment.
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
      :location
    )
  end
end
