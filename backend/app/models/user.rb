class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, # <-- Added for password reset
         :jwt_authenticatable, jwt_revocation_strategy: Devise::JWT::RevocationStrategies::JTIMatcher

  
  # Associations
  has_many :applications, foreign_key: :candidate_id, dependent: :destroy
  has_many :interviews, foreign_key: :interviewer_id, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :interview_feedbacks, dependent: :destroy
  has_many :articles, foreign_key: 'author_id', dependent: :destroy
  has_many :article_reactions, dependent: :destroy
  has_many :comments, foreign_key: 'commenter_id', dependent: :destroy
  
  # Callbacks
  before_create :set_jti
  before_validation :downcase_email
  before_destroy :reset_applications_status_if_rh

  # Validations
  validates :active, inclusion: { in: [true, false] }
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: /\A[^@\s]+@[^@\s]+\z/ }  

  # Role enum
  enum :role, { admin: 0, rh: 1, candidate: 2 }, default: :candidate

  # Method to increment the login count
  def increment_login_count
    increment!(:nbCnx)
  end

  private

  def set_jti
    self.jti ||= SecureRandom.uuid
  end

  def downcase_email
    self.email = email&.downcase&.strip
  end


  def reset_applications_status_if_rh
    return unless rh? # only do this if the user is HR (interviewer)

    interviews.includes(:application).each do |interview|
      application = interview.application
      application.update(status: 'Pending') if application.present?
    end
  end
end