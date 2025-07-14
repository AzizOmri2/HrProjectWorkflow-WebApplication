class RemoveCompanyFromJobOffers < ActiveRecord::Migration[8.0]
  def change
    remove_column :offers, :company, :string
  end
end
