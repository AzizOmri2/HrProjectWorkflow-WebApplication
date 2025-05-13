import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interviews-list',
  imports: [RouterModule,CommonModule, FilterPipe, FormsModule],
  templateUrl: './interviews-list.component.html',
  styleUrl: './interviews-list.component.css'
})
export class InterviewsListComponent implements OnInit{
  interviews:any;
  actionText: string = 'Sort By';
  searchText: string = '';


  constructor(private interviewService: InterviewService, private router : Router){

  }

  ngOnInit(){
    this.InterviewsList()
  }

  InterviewsList(){
    this.interviews = this.interviewService.getAllInterviews().subscribe(
      interview => {
        this.interviews = interview
        console.log(this.interviews);
      }
    )
  }

  // Delete Interview
  deleteInterview(id: number) {
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewService.deleteInterview(id).subscribe(
        () => {
          // Refresh the interview list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting interview:', error);
        }
      );
    }
  }


  setActionText(text: string) {
    this.actionText = text;
  }
}
