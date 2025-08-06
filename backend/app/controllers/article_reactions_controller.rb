class ArticleReactionsController < ApplicationController
  before_action :set_article
  before_action :authenticate_user!

  # Returns the current user's reaction (like/dislike) for a given article
  def user_reaction
    user = User.find_by(id: params[:user_id])

    user_reaction = nil
    if user && @article
      reaction = ArticleReaction.find_by(user: user, article: @article)
      user_reaction = reaction&.reaction
    end

    render json: { user_reaction: user_reaction }
  end

  # Handles the 'like' action on an article by a user
  def like
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article)

    if reaction&.reaction == 'like'
      render json: { error: 'Already liked' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      if reaction&.reaction == 'dislike'
        # Change existing reaction from 'dislike' to 'like'
        reaction.update!(reaction: 'like')
        @article.increment!(:nb_likes)
        @article.decrement!(:nb_dislikes)
      else
        # Create a new 'like' reaction
        ArticleReaction.create!(user: user, article: @article, reaction: 'like')
        @article.increment!(:nb_likes)
      end

      # ✅ Only notify if the user is not the author
      if user.id != @article.author_id
        Notification.create!(
          user: @article.author,
          title: "New Reaction Received",
          message: "#{user.name} liked your article: #{@article.title}",
          read: false
        )
      end
    end

    render json: { nb_likes: @article.nb_likes, nb_dislikes: @article.nb_dislikes }
  end

  # Removes a 'like' reaction from an article
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

  # Handles the 'dislike' action on an article by a user
  def dislike
    user = User.find_by(id: params[:user_id])
    return render json: { error: 'User not found' }, status: :unauthorized if user.nil?

    reaction = ArticleReaction.find_by(user: user, article: @article)

    if reaction&.reaction == 'dislike'
      render json: { error: 'Already disliked' }, status: :unprocessable_entity and return
    end

    ArticleReaction.transaction do
      if reaction&.reaction == 'like'
        # Change existing reaction from 'like' to 'dislike'
        reaction.update!(reaction: 'dislike')
        @article.increment!(:nb_dislikes)
        @article.decrement!(:nb_likes)
      else
        # Create a new 'dislike' reaction
        ArticleReaction.create!(user: user, article: @article, reaction: 'dislike')
        @article.increment!(:nb_dislikes)
      end

      # ✅ Only notify if the user is not the author
      if user.id != @article.author_id
        Notification.create!(
          user: @article.author, # author of the article
          title: "New Reaction Recieved",
          message: "#{user.name} disliked your article: #{@article.title}",
          read: false
        )
      end
    end

    render json: { nb_likes: @article.nb_likes, nb_dislikes: @article.nb_dislikes }
  end

  # Removes a 'dislike' reaction from an article
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

  # Finds and sets the article based on the article_id param
  def set_article
    @article = Article.find(params[:article_id])
  end
end
