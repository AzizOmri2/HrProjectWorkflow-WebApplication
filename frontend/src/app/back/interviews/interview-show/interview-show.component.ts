import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewFeedbacksService } from '../../../services/interview-feedbacks.service';

@Component({
  selector: 'app-interview-show',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './interview-show.component.html',
  styleUrl: './interview-show.component.css'
})
export class InterviewShowComponent implements OnInit{
  userId!: number;
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

  feedback: string = '';  // Variable to hold the feedback text
  rating: number = 0;  // Variable to hold the rating

  interviewfeedbacks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService,
    private interviewFeedbackService: InterviewFeedbacksService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idStr = localStorage.getItem('user_id');
    const id = idStr ? +idStr : null; // Convert to number

    if (id !== null) {
      this.userId = id;
    }

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

      this.interviewFeedbackService.getInterviewFeedbacksByIdInterview(this.interviewId).subscribe({
        next: data => {
          this.interviewfeedbacks = data;
        },
        error: err => {
          console.error('Error fetching feedbacks for this interview', err);
        }
      });
    }
    
  }


  onValidateInterviewAccept(interviewId: number): void {
    this.interviewService.validateInterviewAccept(interviewId).subscribe({
      next: (response) => {
        console.log('Interview validated:', response);
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Validation failed:', error);
      }
    });
  }


  onValidateInterviewReject(interviewId: number): void {
    this.interviewService.validateInterviewReject(interviewId).subscribe({
      next: (response) => {
        console.log('Interview validated:', response);
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Validation failed:', error);
      }
    });
  }


  // Method to submit the feedback
  submitFeedback(): void {
    const feedbackData = {
      interview_id: this.interview.id,
      user_id: this.userId, 
      feedback: this.feedback,
      rating: this.rating
    };

    if(feedbackData.interview_id && feedbackData.user_id && feedbackData.feedback && feedbackData.rating){
      this.interviewFeedbackService.createInterviewFeedbacks(feedbackData).subscribe(
        (response) => {
          console.log('Feedback submitted successfully', response);
          // Optionally, reset the form and append the new feedback to the list
          this.ngOnInit();
          this.feedback = '';
          this.rating = 0;
        },
        (error) => {
          console.error('Error submitting feedback', error);
        }
      );
    }else{
      alert('Please fill all required fields !')
    }
    
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete your feedback?')) {
      this.interviewFeedbackService.deleteInterviewFeedback(id).subscribe(
        () => {
          // Refresh the feedback list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting feedback:', error);
        }
      );
    }
  }

}
