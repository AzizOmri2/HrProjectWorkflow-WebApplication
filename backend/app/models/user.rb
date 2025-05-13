class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::JTIMatcher

  before_create :set_jti
  before_validation :downcase_email

  # Validations
  validates :active, inclusion: { in: [true, false] }

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

end