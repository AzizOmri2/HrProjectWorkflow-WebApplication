class CreateOffers < ActiveRecord::Migration[8.0]
  def change
    create_table :offers do |t|
      t.string :title
      t.string :department
      t.text :skills_required
      t.string :experience_level
      t.date :deadline
      t.integer :status, default: 0
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end