class ChangeInterviewDateTypeInInterviews < ActiveRecord::Migration[8.0]
  def change
    change_column :interviews, :interview_date, :date, using: 'interview_date::date'
  end
end
