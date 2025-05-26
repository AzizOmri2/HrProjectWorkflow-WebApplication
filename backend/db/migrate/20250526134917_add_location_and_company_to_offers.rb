class AddLocationAndCompanyToOffers < ActiveRecord::Migration[8.0]
  def change
    add_column :offers, :location, :string
    add_column :offers, :company, :string
  end
end
