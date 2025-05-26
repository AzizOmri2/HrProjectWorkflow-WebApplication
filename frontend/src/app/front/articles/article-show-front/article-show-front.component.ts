import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-article-show-front',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './article-show-front.component.html',
  styleUrl: './article-show-front.component.css'
})
export class ArticleShowFrontComponent implements OnInit{
  currentUserId: number = 0;
  articleId!: number;
  article: any = {
    title: '',
    content: '',
    author_id: '',
    image: '',
    nb_likes: '',
    created_at: '',
    nb_dislikes: ''
  };

  comment: any = {
    content: '',
    commenter_id: '',
    article_id: ''
  };

  articles:any;
  comments:any;

  likeCount: number = 0;
  dislikeCount: number = 0;
  hasLiked: boolean | null = null;
  hasDisliked: boolean | null = null;


  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.comment.article_id = this.articleId;
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    this.currentUserId = userId ? +userId : 0;
    
    if (this.currentUserId) {
      this.comment.commenter_id = this.currentUserId;  // Assign to commenter_id
      if (this.articleId) {
        this.articleService.getArticleById(this.articleId).subscribe({
          next: data => {
            this.article = data;
            this.likeCount = data.nb_likes;
            this.dislikeCount = data.nb_dislikes;

            // Now check user reaction after loading article
            this.articleService.getUserReaction(this.articleId, this.currentUserId).subscribe({
              next: reactionData => {
                // Use user_reaction key from your Rails JSON response
                this.hasLiked = reactionData.user_reaction === 'like';
                this.hasDisliked = reactionData.user_reaction === 'dislike';
              },
              error: err => {
                console.error('Error fetching user reaction:', err);
                this.hasLiked = false;
                this.hasDisliked = false;
              }
            });
          },
          error: err => {
            console.error('Error fetching article', err);
          }
        });

        this.commentService.getCommentsByIdArticle(this.articleId).subscribe({
          next: data => {
            this.comments = data;
          },
          error: err => {
            console.error('Error fetching comments for this article', err);
          }
        });
      }
    } else {
      console.error('User ID not found in localStorage');
    }
    this.ArticlesList();
  }


  ArticlesList() {
    this.articleService.getAllArticles().subscribe(
      articles => {
        this.articles = articles;
        console.log(this.articles);
      },
      error => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  likeArticle() {
    if (this.hasLiked) {
      // User wants to remove their like (unlike)
      this.articleService.unlikeArticle(this.articleId, this.currentUserId).subscribe({
        next: () => {
          this.likeCount--;
          this.hasLiked = false;
        },
        error: err => {
          console.error('Error unliking article:', err);
        }
      });
    } else {
      // User wants to like the article
      this.articleService.likeArticle(this.articleId, this.currentUserId).subscribe({
        next: () => {
          this.likeCount++;
          this.hasLiked = true;

          if (this.hasDisliked) {
            // Remove previous dislike
            this.dislikeCount--;
            this.hasDisliked = false;
          }
        },
        error: err => {
          console.error('Error liking article:', err);
        }
      });
    }
  }

  dislikeArticle() {
    if (this.hasDisliked) {
      // User wants to remove their dislike (undislike)
      this.articleService.undislikeArticle(this.articleId, this.currentUserId).subscribe({
        next: () => {
          this.dislikeCount--;
          this.hasDisliked = false;
        },
        error: err => {
          console.error('Error undisliking article:', err);
        }
      });
    } else {
      // User wants to dislike the article
      this.articleService.dislikeArticle(this.articleId, this.currentUserId).subscribe({
        next: () => {
          this.dislikeCount++;
          this.hasDisliked = true;

          if (this.hasLiked) {
            // Remove previous like
            this.likeCount--;
            this.hasLiked = false;
          }
        },
        error: err => {
          console.error('Error disliking article:', err);
        }
      });
    }
  }

  submitComment(){
    this.commentService.createComment(this.comment).subscribe(
      response => {
        console.log('Comment added successfully:', response);
        this.ngOnInit();
        this.comment.content='';
      },
      error => {
        console.error('Error adding comment:', error);
      }
    );
  }

  deleteComment(id:number){
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(
        () => {
          // Refresh the comment list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }
}
