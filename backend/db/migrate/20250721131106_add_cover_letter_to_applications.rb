class AddCoverLetterToApplications < ActiveRecord::Migration[8.0]
  def change
    add_column :applications, :cover_letter, :text
  end
end
