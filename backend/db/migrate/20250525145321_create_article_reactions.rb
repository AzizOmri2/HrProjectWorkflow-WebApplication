class CreateArticleReactions < ActiveRecord::Migration[8.0]
  def change
    create_table :article_reactions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :article, null: false, foreign_key: true
      t.string :reaction, null: false

      t.timestamps
    end
    add_index :article_reactions, [:user_id, :article_id], unique: true
  end
end
