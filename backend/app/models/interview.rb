class Interview < ApplicationRecord
  belongs_to :application, class_name: 'Application'
  belongs_to :interviewer, class_name: 'User'
end
