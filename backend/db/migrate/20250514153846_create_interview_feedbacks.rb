class CreateInterviewFeedbacks < ActiveRecord::Migration[8.0]
  def change
    create_table :interview_feedbacks do |t|
      t.references :interview, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :feedback
      t.integer :rating
      t.timestamps
    end
  end
end
