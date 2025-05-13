class Application < ApplicationRecord
  belongs_to :job_offer, class_name: 'Offer'
  belongs_to :candidate, class_name: 'User'
end
