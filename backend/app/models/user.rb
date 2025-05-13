class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::JTIMatcher

  has_one_attached :image
  before_save :set_jti
  before_validation :downcase_email

  # Validate email
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: /\A[^@\s]+@[^@\s]+\z/ }  

  # Role enum definition for Rails 8
  enum :role, { admin: 0, rh: 1, candidate: 2 }, default: :candidate

  private

  def set_jti
    self.jti ||= SecureRandom.uuid
  end

  def downcase_email
    self.email = email&.downcase&.strip
  end

  def image_url
    if image.attached?
      Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true)
    else
      'uploads/aa.png' # Returning a default image path if no image is attached
    end
  end

end