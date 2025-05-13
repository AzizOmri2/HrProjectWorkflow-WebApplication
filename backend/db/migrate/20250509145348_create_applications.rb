class CreateApplications < ActiveRecord::Migration[8.0]
  def change
    create_table :applications do |t|
      t.references :job_offer, null: false, foreign_key: { to_table: :offers }
      t.references :candidate, null: false, foreign_key: { to_table: :users }
      t.string :cv_file
      t.string :status
      t.datetime :applied_at

      t.timestamps
    end
  end
end
