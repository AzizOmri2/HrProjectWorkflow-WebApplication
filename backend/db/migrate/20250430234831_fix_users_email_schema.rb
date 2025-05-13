class FixUsersEmailSchema < ActiveRecord::Migration[7.0]
  def change
    # Remove default empty string for email
    change_column_default :users, :email, nil
    # Remove default empty string for encrypted_password
    change_column_default :users, :encrypted_password, nil
    # Remove existing email index
    remove_index :users, :email if index_exists?(:users, :email)
    # Add case-insensitive unique index
    add_index :users, 'LOWER(email)', unique: true, name: 'index_users_on_email'
  end
end