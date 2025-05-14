class InterviewFeedback < ApplicationRecord
  belongs_to :interview
  belongs_to :user
end
