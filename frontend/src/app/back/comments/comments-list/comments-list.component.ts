import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentShowComponent } from '../comment-show/comment-show.component';

declare var $: any;


@Component({
  selector: 'app-comments-list',
  imports: [RouterModule, FormsModule, CommonModule, CommentShowComponent],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css'
})


export class CommentsListComponent implements OnInit{
  userRole: string | null = null;
  filterText: string = '';
  comments: any[] = []; // Your original comments list
  filteredComments: any[] = [];

  selectedCommentId: number | null = null;
  showModal = false;

  commentIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this comment?';
  typeAlert = '';
  alertMessage='';

  constructor(
    private commentService: CommentService
  ){}

  ngOnInit(){
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
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

  // Called from UI (when user clicks Delete button)
  deleteComment(id: number) {
    this.commentIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this comment?';
    $('#confirmDeleteModal').modal('show');
  }

  // Called when user confirms deletion
  confirmDelete() {
    if (this.commentIdToDelete !== null) {
      this.commentService.deleteComment(this.commentIdToDelete).subscribe(
        () => {
          this.CommentsList();
          this.commentIdToDelete = null;

          // Show success modal
          this.typeAlert = 'success';
          this.alertMessage = "The selected comment was deleted successfully. The list has been updated accordingly.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "The system encountered an issue while deleting the comment. Please review your data or try again later.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
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

  ngAfterViewInit() {
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}
