class ArticleReaction < ApplicationRecord
  belongs_to :user
  belongs_to :article

  validates :reaction, presence: true, inclusion: { in: ['like', 'dislike'] }
end
