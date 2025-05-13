class CreateInterviews < ActiveRecord::Migration[8.0]
  def change
    create_table :interviews do |t|
      t.references :application, null: false, foreign_key: true
      t.datetime :interview_date, null: false
      t.references :interviewer, null: false, foreign_key: { to_table: :users }
      t.string :link
      t.string :status
      t.string :result
      t.integer :duration
      t.string :notes

      t.timestamps
    end
  end
end
