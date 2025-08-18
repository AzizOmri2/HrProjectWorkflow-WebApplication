class ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_article, only: [:show, :update, :destroy]

  # GET /articles
  def index
    @articles = Article.includes(:author).all
    render json: @articles.map { |article| article_json(article) }
  end

  # GET /articles/:id
  def show
    render json: article_json(@article)
  end

  # POST /articles (secured)
  def create
    @article = Article.new(article_params)

    if params[:article][:image].present?
      uploaded_image = params[:article][:image]
      timestamp = Time.now.strftime('%Y%m%d%H%M%S')
      safe_title = @article.title.parameterize.underscore
      new_filename = "Image_#{safe_title}_#{current_user.id}_#{timestamp}#{File.extname(uploaded_image.original_filename)}"

      # Ensure directory exists
      image_dir = Rails.root.join('public', 'uploads', 'article_images')
      FileUtils.mkdir_p(image_dir) unless Dir.exist?(image_dir)

      image_path = image_dir.join(new_filename)
      File.open(image_path, 'wb') { |file| file.write(uploaded_image.read) }

      @article.image = "uploads/article_images/#{new_filename}"
    end

    @article.author = current_user

    if @article.save
      render json: @article, status: :created
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /articles/:id (secured)
  def update
    if @article.update(article_params.except(:image))
      if params[:article][:image].present?
        uploaded_image = params[:article][:image]
        timestamp = Time.now.strftime('%Y%m%d%H%M%S')
        safe_title = @article.title.parameterize.underscore
        new_filename = "Image_#{safe_title}_#{@article.author.id}_#{timestamp}#{File.extname(uploaded_image.original_filename)}"

        image_path = Rails.root.join('public', 'uploads', 'article_images', new_filename)
        File.open(image_path, 'wb') { |file| file.write(uploaded_image.read) }

        @article.update(image: "uploads/article_images/#{new_filename}")
      end

      render json: @article
    else
      render json: @article.errors, status: :unprocessable_entity
    end
  end

  # DELETE /articles/:id (secured)
  def destroy
    image_path = Rails.root.join('public', @article.image) if @article.image.present?
    @article.destroy
    File.delete(image_path) if image_path && File.exist?(image_path)
    head :no_content
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_json(article)
    article.as_json(only: [:id, :title, :content, :image, :nb_likes, :nb_dislikes, :created_at]).merge(
      author: {
        id: article.author.id,
        name: article.author.name
      }
    )
  end

  def article_params
    params.require(:article).permit(:title, :content, :author_id, :image, :nb_likes, :nb_dislikes)
  end
end
