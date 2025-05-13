class AddActiveToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :active, :boolean, default: true, null: false
    add_column :users, :active_status, :string # Optional: a field for any additional status information if necessary
  end
end