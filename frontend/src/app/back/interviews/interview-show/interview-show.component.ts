import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
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
export class InterviewShowComponent{
  userId!: number;
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
    private interviewService: InterviewService,
    private interviewFeedbackService: InterviewFeedbacksService
  ) {}

  @Input() interviewId!: number;
  @Output() feedbackUpdated = new EventEmitter<void>();


  ngOnChanges() {
    this.loadInterviewFeedbacksData();
  }

  loadInterviewFeedbacksData() {
    const idStr = localStorage.getItem('user_id');
    const id = idStr ? +idStr : null;

    if (id !== null) {
      this.userId = id;
    }

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
          this.interviewfeedbacks = data; // create a new array reference
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

    if (feedbackData.feedback && feedbackData.rating) {
      if (feedbackData.rating < 1 || feedbackData.rating > 5) {
        alert('Rating must be between 1 and 5.');
        return;
      }else{
        this.interviewFeedbackService.createInterviewFeedbacks(feedbackData).subscribe(
          (response) => {
            console.log('Feedback submitted successfully', response);          
          },
          (error) => {
            console.error('Error submitting feedback', error);
          }
        );
        this.feedback = '';
        this.rating = 0;

        // Notify parent to reload modal
        this.feedbackUpdated.emit();
      }
    } else {
      alert('Please fill all required fields!');
    }
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete your feedback?')) {
      this.interviewFeedbackService.deleteInterviewFeedback(id).subscribe(
        () => {
          // Notify parent to reload modal
          this.feedbackUpdated.emit();
        },
        error => {
          console.error('Error deleting feedback:', error);
        }
      );
    }
  }

}
