import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { FlashMessageService } from '../../../flash-message.service';

@Component({
  selector: 'app-article-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './article-show.component.html',
  styleUrl: './article-show.component.css'
})
export class ArticleShowComponent{
  article: any = {
    title: '',
    content: '',
    author_id: '',
    image: '',
    nb_likes: 0
  };

  @Input() articleId!: number;

  applications: any[] = [];

  currentUserId: number = 0;
  likeCount: number = 0;
  dislikeCount: number = 0;
  hasLiked: boolean | null = null;
  hasDisliked: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private flashMessageService: FlashMessageService
  ) {}

  ngOnChanges() {

    const userId = localStorage.getItem('user_id');
    if (userId && !isNaN(+userId)) {
      this.currentUserId = +userId;
    } else {
      this.currentUserId = 0; // 0 means user is not logged in
      console.warn('User is not connected. Limited access applied.');
    }

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
    }
  }


  likeArticle() {
    if(this.currentUserId !== 0){
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
    }else{
      this.flashMessageService.setMessage('error', 'You need to sign in to like an article.');
      window.location.href = '/login';
    }
    
  }

  dislikeArticle() {
    if(this.currentUserId !== 0){

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

    }else{
      this.flashMessageService.setMessage('error', 'You need to sign in to dislike an article.');
      window.location.href = '/login';
    }
    
  }
}
