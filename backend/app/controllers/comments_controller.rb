class CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_comment, only: [:show, :update, :destroy]

  # GET /comments
  # ✅ Returns all comments with their commenter and article info
  def index
    @comments = Comment.includes(:commenter, :article).all
    render json: @comments.map { |comment| comment_json(comment) }
  end

  # GET /comments/:id
  # ✅ Returns a specific comment
  def show
    render json: comment_json(@comment)
  end

  # POST /comments
  # ✅ Creates a new comment and sends notification to article author (if not commenter)
  def create
    @comment = current_user.comments.build(comment_params.except(:commenter_id))

    if @comment.save
      # 🟨 Send notification only if commenter is NOT the article author
      article = @comment.article
      if article.author != current_user
        Notification.create!(
          user: article.author,
          title: "New Comment on Your Article",
          message: "#{current_user.name} commented on your article: #{article.title}",
          read: false
        )
      end

      render json: comment_json(@comment), status: :created
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /comments/:id
  # ✅ Updates a comment
  def update
    if @comment.update(comment_params.except(:commenter_id))
      render json: comment_json(@comment)
    else
      render json: @comment.errors, status: :unprocessable_entity
    end
  end

  # DELETE /comments/:id
  # ✅ Deletes a comment
  def destroy
    @comment.destroy
    head :no_content
  end

  # GET /comments/:article_id/by_id_article
  # ✅ Returns all comments for a given article
  def comments_by_article
    article = Article.find(params[:article_id])
    comments = article.comments.includes(:commenter)

    render json: comments.map { |comment| comment_json(comment) }
  end

  private

  # 🔧 Finds the comment by ID
  def set_comment
    @comment = Comment.find(params[:id])
  end

  # 📦 Permits comment parameters (note: commenter_id is excluded when creating/updating)
  def comment_params
    params.require(:comment).permit(:content, :article_id, :commenter_id)
  end

  # 📤 Builds a JSON response for a comment with nested commenter and article info
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
