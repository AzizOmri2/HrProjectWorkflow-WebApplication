class AddNbCnxToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :nbCnx, :integer, default: 0
  end
end
