class CreateArticles < ActiveRecord::Migration[8.0]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :content
      t.references :author, foreign_key: { to_table: :users }
      t.string :image
      t.integer :nb_likes, default: 0

      t.timestamps
    end
  end
end
