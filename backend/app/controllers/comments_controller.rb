class CommentsController < ApplicationController
  before_action :set_comment, only: [:show, :update, :destroy]

  # GET /comments
  def index
    @comments = Comment.includes(:commenter, :article).all
    render json: @comments.map { |comment| comment_json(comment) }
  end

  # GET /comments/:id
  def show
    render json: comment_json(@comment)
  end

  # POST /comments
  def create
    @comment = Comment.new(comment_params)

    if @comment.save
      render json: comment_json(@comment), status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/:id
  def update
    if @comment.update(comment_params)
      render json: comment_json(@comment)
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/:id
  def destroy
    @comment.destroy
    head :no_content
  end

  # GET /comments/:article_id/by_id_article
  def comments_by_article
    article = Article.find(params[:article_id])
    comments = article.comments.includes(:commenter)

    render json: comments.map { |comment| comment_json(comment) }
  end

  private

  def set_comment
    @comment = Comment.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content, :article_id, :commenter_id)
  end

  def comment_json(comment)
    {
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      commenter: {
        id: comment.commenter.id,
        name: comment.commenter.name,
        image: comment.commenter.image
      },
      article: {
        id: comment.article.id,
        title: comment.article.title
      }
    }
  end
end
