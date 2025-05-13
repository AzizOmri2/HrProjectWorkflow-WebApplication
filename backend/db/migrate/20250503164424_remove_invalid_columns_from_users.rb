class RemoveInvalidColumnsFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_column :users, :default
    remove_column :users, :true
  end
end