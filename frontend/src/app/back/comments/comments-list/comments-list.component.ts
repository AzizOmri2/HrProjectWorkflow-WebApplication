import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentShowComponent } from '../comment-show/comment-show.component';

@Component({
  selector: 'app-comments-list',
  imports: [RouterModule, FormsModule, CommonModule, CommentShowComponent],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css'
})
export class CommentsListComponent implements OnInit{
  
  filterText: string = '';
  comments: any[] = []; // Your original comments list
  filteredComments: any[] = [];

  selectedCommentId: number | null = null;
  showModal = false;

  constructor(private commentService: CommentService, private router : Router){

  }

  ngOnInit(){
    this.CommentsList()
  }

  CommentsList(){
    this.commentService.getAllComments().subscribe(
      (comment: any[]) => {
        this.comments = comment;
        this.filteredComments = [...this.comments]; // initialize filtered list
        console.log(this.comments);
      },
      error => {
        console.error('Error fetching comments:', error);
      }
    );
  }


  openCommentInfo(commentId: number) {
    this.selectedCommentId = commentId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.selectedCommentId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  // Delete comment
  deleteComment(id: number) {
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

  applyFilters() {
    this.filteredComments = this.comments.filter((comment: any) =>
      (this.filterText === '' ||
        comment.content.toLowerCase().includes(this.filterText.toLowerCase()) ||
        comment.commenter.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        comment.article.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        comment.created_at.toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
  }

  resetFilters() {
    this.filterText = '';
    this.filteredComments = [...this.comments];
  }
}
