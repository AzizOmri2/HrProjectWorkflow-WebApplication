class AddDescriptionToOffers < ActiveRecord::Migration[8.0]
  def change
    add_column :offers, :description, :text
  end
end
