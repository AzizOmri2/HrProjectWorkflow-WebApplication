import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '../../../services/comment.service';
import { ArticleService } from '../../../services/article.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


declare var $: any;


@Component({
  selector: 'app-update-comment',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-comment.component.html',
  styleUrl: './update-comment.component.css'
})


export class UpdateCommentComponent implements OnInit{
  commentId!: number;
  comment: any = {
    content: '',
    commenter_id: '',
    article_id: ''
  };
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private articleService: ArticleService
  ) {}

  articles: any[] = [];

  ngOnInit(): void {
    this.commentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.commentId) {
      this.commentService.getCommentById(this.commentId).subscribe({
        next: data => {
          this.comment = data;
          this.comment.article_id = data.article.id;
        },
        error: err => {
          console.error('Error fetching comment', err);
        }
      });
    }

    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.comment.commenter_id = userId;  // Assign to commenter_id
    } else {
      console.error('User ID not found in localStorage');
    }

    this.articleService.getAllArticles().subscribe(data => {
      this.articles = data;
    });
  }

  onSubmit() {
    this.commentService.updateComment(this.commentId, this.comment).subscribe({
      next: res => {
        this.typeAlert = 'success';
        this.error = "Your changes to the comment have been saved."
        $('#alertModal').modal('show');
      },
      error: err => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while updating the comment. Please review your data or try again later."
        $('#alertModal').modal('show');
      }
    });
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
