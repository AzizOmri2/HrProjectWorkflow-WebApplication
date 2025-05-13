class ChangeInterviewDateToTimestampInInterviews < ActiveRecord::Migration[8.0]
  def change
    change_column :interviews, :interview_date, :timestamp, precision: 6, null: false
  end
end
