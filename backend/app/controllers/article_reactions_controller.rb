class ArticleReactionsController < ApplicationController
  before_action :set_article

  def user_reaction
    user = User.find_by(id: params[:user_id])

    user_reaction = nil
    if user && @article
      reaction = ArticleReaction.find_by(user: user, article: @article)
      user_reaction = reaction&.reaction
    end

    render json: { user_reaction: user_reaction }
  end


  def like
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article)

    if reaction&.reaction == 'like'
      render json: { error: 'Already liked' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      if reaction&.reaction == 'dislike'
        reaction.update!(reaction: 'like')
        @article.increment!(:nb_likes)
        @article.decrement!(:nb_dislikes)
      else
        ArticleReaction.create!(user: user, article: @article, reaction: 'like')
        @article.increment!(:nb_likes)
      end
    end

    render json: { nb_likes: @article.nb_likes, nb_dislikes: @article.nb_dislikes }
  end

  def unlike
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article, reaction: 'like')

    if reaction.nil?
      render json: { error: 'No like to remove' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      reaction.destroy!
      @article.decrement!(:nb_likes)
    end

    render json: { nb_likes: @article.nb_likes }
  end

  def dislike
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article)

    if reaction&.reaction == 'dislike'
      render json: { error: 'Already disliked' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      if reaction&.reaction == 'like'
        reaction.update!(reaction: 'dislike')
        @article.increment!(:nb_dislikes)
        @article.decrement!(:nb_likes)
      else
        ArticleReaction.create!(user: user, article: @article, reaction: 'dislike')
        @article.increment!(:nb_dislikes)
      end
    end

    render json: { nb_likes: @article.nb_likes, nb_dislikes: @article.nb_dislikes }
  end

  def undislike
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article, reaction: 'dislike')

    if reaction.nil?
      render json: { error: 'No dislike to remove' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      reaction.destroy!
      @article.decrement!(:nb_dislikes)
    end

    render json: { nb_dislikes: @article.nb_dislikes }
  end

  private

  def set_article
    @article = Article.find(params[:article_id])
  end
end