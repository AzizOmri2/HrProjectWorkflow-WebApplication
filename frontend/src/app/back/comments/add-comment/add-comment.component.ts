import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommentService } from '../../../services/comment.service';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var $: any;

@Component({
  selector: 'app-add-comment',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.css'
})


export class AddCommentComponent implements OnInit{
  comment: any = {
    content: '',
    commenter_id: '',
    article_id: null
  };
  typeAlert = '';
  error='';
  

  constructor(
    private commentService: CommentService, 
    private articleService: ArticleService
  ) {}

  articles: any[] = [];


  ngOnInit(): void {
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
    this.commentService.createComment(this.comment).subscribe(
      response => {
        this.typeAlert = 'success';
        this.error = "Your comment has been submitted and recorded successfully."
        $('#alertModal').modal('show');
      },
      error => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while submitting your comment. Please review your data or try again later.";
        $('#alertModal').modal('show');
      }
    );
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
