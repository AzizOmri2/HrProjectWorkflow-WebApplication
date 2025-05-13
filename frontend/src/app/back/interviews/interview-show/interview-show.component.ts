import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interview-show',
  imports: [RouterModule,CommonModule],
  templateUrl: './interview-show.component.html',
  styleUrl: './interview-show.component.css'
})
export class InterviewShowComponent implements OnInit{
  interviewId!: number;
  interview: any = {
    application_id: '',
    interview_date: '',
    interviewer_id: '',
    link: '',
    status: '',
    result: '',
    duration: '',
    notes: ''
  };
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.interviewId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.interviewId) {
      this.interviewService.getInterviewById(this.interviewId).subscribe({
        next: data => {
          this.interview = data;
        },
        error: err => {
          console.error('Error fetching Interview', err);
        }
      });
    }
  }


  onValidateInterviewAccept(interviewId: number): void {
    this.interviewService.validateInterviewAccept(interviewId).subscribe({
      next: (response) => {
        console.log('Interview validated:', response);
        this.ngOnInit();
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Interview was successfully accepted."
      },
      error: (error) => {
        console.error('Validation failed:', error);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = error.error?.error || "There was an error with your interview's accept. Please try again.";
      }
    });
  }


  onValidateInterviewReject(interviewId: number): void {
    this.interviewService.validateInterviewReject(interviewId).subscribe({
      next: (response) => {
        console.log('Interview validated:', response);
        this.ngOnInit();
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Interview was successfully rejected."
      },
      error: (error) => {
        console.error('Validation failed:', error);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = error.error?.error || "There was an error with your interview's reject. Please try again.";
      }
    });
  }
}
