import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewFeedbacksService } from '../../../services/interview-feedbacks.service';

@Component({
  selector: 'app-interview-show',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './interview-show.component.html',
  styleUrl: './interview-show.component.css'
})
export class InterviewShowComponent implements OnChanges {
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

  feedback: string = '';
  rating: number = 0;

  interviewfeedbacks: any[] = [];

  isEditing: boolean = false;                     // For toggling edit mode
  editingFeedbackId: number | null = null;        // Track the feedback being edited

  constructor(
    private interviewService: InterviewService,
    private interviewFeedbackService: InterviewFeedbacksService
  ) {}


  @Input() interviewId!: number;
  @Output() feedbackUpdated = new EventEmitter<void>();
  @Output() interviewChanged = new EventEmitter<boolean>(); // Used to notify parent of changes for full list reload

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
        this.feedbackUpdated.emit();                     // Reload modal content
        this.interviewChanged.emit(true);                // ✅ Notify parent to refresh interview list
      },
      error: (error) => {
        console.error('Validation failed:', error);
      }
    });
  }

  onValidateInterviewReject(interviewId: number): void {
    this.interviewService.validateInterviewReject(interviewId).subscribe({
      next: (response) => {
        this.feedbackUpdated.emit();                     // Reload modal content
        this.interviewChanged.emit(true);                // ✅ Notify parent to refresh interview list
      },
      error: (error) => {
        console.error('Validation failed:', error);
      }
    });
  }

  // ADDED: Begin editing selected feedback
  editFeedback(feedback: any): void {
    this.feedback = feedback.feedback;
    this.rating = feedback.rating;
    this.isEditing = true;
    this.editingFeedbackId = feedback.id;
  }

  // ADDED: Reset form
  cancelEdit(): void {
    this.feedback = '';
    this.rating = 0;
    this.isEditing = false;
    this.editingFeedbackId = null;
  }

  // Modified: Create or update feedback
  submitFeedback(): void {
    if (!this.feedback || !this.rating) {
      alert('Please fill all required fields!');
      return;
    }

    if (this.rating < 1 || this.rating > 5) {
      alert('Rating must be between 1 and 5.');
      return;
    }

    const feedbackData = {
      interview_id: this.interview.id,
      user_id: this.userId,
      feedback: this.feedback,
      rating: this.rating
    };

    if (this.isEditing && this.editingFeedbackId !== null) {
      // Update feedback
      this.interviewFeedbackService.updateInterviewFeedback(this.editingFeedbackId, feedbackData).subscribe(
        () => {
          this.feedbackUpdated.emit();                     // Reload modal content
          this.interviewChanged.emit(true);                // ✅ Notify parent to refresh interview list
          this.loadInterviewFeedbacksData();               // refresh list
          this.cancelEdit();
        },
        error => {
          console.error('Error updating feedback:', error);
        }
      );
    } else {
      // Create feedback
      this.interviewFeedbackService.createInterviewFeedbacks(feedbackData).subscribe(
        () => {
          this.feedbackUpdated.emit();                     // Reload modal content
          this.interviewChanged.emit(true);                // ✅ Notify parent to refresh interview list
          this.loadInterviewFeedbacksData();               // refresh list
          this.cancelEdit();
        },
        error => {
          console.error('Error submitting feedback', error);
        }
      );
    }
  }

  deleteFeedback(id: number) {
    if (confirm('Are you sure you want to delete your feedback?')) {
      this.interviewFeedbackService.deleteInterviewFeedback(id).subscribe(
        () => {
          this.feedbackUpdated.emit();                     // Reload modal content
          this.interviewChanged.emit(true);                // ✅ Notify parent to refresh interview list
          this.loadInterviewFeedbacksData();               // refresh list
        },
        error => {
          console.error('Error deleting feedback:', error);
        }
      );
    }
  }
}
