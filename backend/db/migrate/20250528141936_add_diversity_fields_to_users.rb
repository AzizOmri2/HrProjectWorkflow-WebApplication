class AddDiversityFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :gender, :string
    add_column :users, :birth_date, :date
    add_column :users, :nationality, :string
    add_column :users, :phone_number, :string
  end
end
