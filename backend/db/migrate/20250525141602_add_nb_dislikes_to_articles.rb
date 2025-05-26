class AddNbDislikesToArticles < ActiveRecord::Migration[8.0]
  def change
    add_column :articles, :nb_dislikes, :integer, default: 0
  end
end
