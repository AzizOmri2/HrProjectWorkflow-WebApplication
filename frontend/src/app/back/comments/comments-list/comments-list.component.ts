import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';

@Component({
  selector: 'app-comments-list',
  imports: [RouterModule, FormsModule, CommonModule, FilterPipe],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.css'
})
export class CommentsListComponent implements OnInit{
  comments:any;
  actionText: string = 'Sort By';
  searchText: string = '';

  constructor(private commentService: CommentService, private router : Router){

  }

  ngOnInit(){
    this.CommentsList()
  }

  CommentsList(){
    this.comments = this.commentService.getAllComments().subscribe(
      comment => {
        this.comments = comment
        console.log(this.comments);
      }
    )
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

  setActionText(text: string) {
    this.actionText = text;
  }
}
