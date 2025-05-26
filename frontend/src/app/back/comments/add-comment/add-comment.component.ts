import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommentService } from '../../../services/comment.service';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  showAlert = false;
  typeAlert = '';
  error='';
  

  constructor(
    private commentService: CommentService, 
    private articleService: ArticleService,
    private router:Router
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
    this.showAlert = false;
    // Ensure application is valid before submission
    if (this.comment.content && this.comment.commenter_id && this.comment.article_id) {
      this.commentService.createComment(this.comment).subscribe(
        response => {
          console.log('Comment added successfully:', response);
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "The Comment was successfully created."
        },
        error => {
          console.error('Error adding comment:', error);
          this.typeAlert = 'danger';
          this.showAlert = true;
          this.error = error.error?.error || "There was an error with your comment. Please try again.";
        }
      );
    } else {
      this.typeAlert = 'danger';
      this.showAlert = true;
      this.error = "Please fill all required fields."
    }
  }
}
