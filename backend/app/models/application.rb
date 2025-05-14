class Application < ApplicationRecord
  belongs_to :job_offer, class_name: 'Offer'
  belongs_to :candidate, class_name: 'User'
  has_one :interview, dependent: :destroy

  validate :cv_file_must_be_pdf

  private

  def cv_file_must_be_pdf
    if cv_file.present? && !cv_file.end_with?('.pdf')
      errors.add(:cv_file, 'must be a PDF file')
    end
  end
end
