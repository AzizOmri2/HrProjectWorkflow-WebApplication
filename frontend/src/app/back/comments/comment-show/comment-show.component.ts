import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommentService } from '../../../services/comment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './comment-show.component.html',
  styleUrl: './comment-show.component.css'
})
export class CommentShowComponent{
  comment: any = {
    content: '',
    commenter_id: '',
    article_id: ''
  };

  applications: any[] = [];

  @Input() commentId!: number;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private router: Router
  ) {}


  ngOnChanges() {
    if (this.commentId) {
      this.commentService.getCommentById(this.commentId).subscribe({
        next: data => {
          this.comment = data;
        },
        error: err => {
          console.error('Error fetching comment', err);
        }
      });
    }
  }

}
