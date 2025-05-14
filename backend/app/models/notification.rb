class Notification < ApplicationRecord
  belongs_to :user
  validates :title, :message, presence: true
end
