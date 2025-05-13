class Offer < ApplicationRecord
    # Role enum definition for Rails 8
    enum :status, { available: 0, removed: 1 }, default: :available

    belongs_to :created_by, class_name: 'User'

    validates :title, :department, :skills_required, :experience_level, :deadline, :status, :created_by_id, presence: true

    # Include user details when returning offers
    def as_json(options = {})
        super(options).merge(created_by_name: created_by.name)
    end
end
