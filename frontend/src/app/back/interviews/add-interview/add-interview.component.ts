import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-add-interview',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './add-interview.component.html',
  styleUrl: './add-interview.component.css'
})
export class AddInterviewComponent implements OnInit{
  interview: any = {
    application_id: null,
    interview_date: '',
    interviewer_id: null,
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
    private userService: UserService, 
    private applicationService: ApplicationService, 
    private interviewService: InterviewService
  ) {}

  applications: any[] = [];
  users: any;


  ngOnInit(): void {
    this.applicationService.getApplicationsNotWithdrawn().subscribe(data => {
      this.applications = data;
    });

    this.userService.getAllHR().subscribe(data =>{
      this.users = data;
    });
    this.interview.status = 'Scheduled';
    this.interview.result = 'Pending';
    //this.application.applied_at = new Date().toISOString();
  }

  onSubmit() {
    this.showAlert = false;
    // Ensure interview is valid before submission
    if (this.interview.application_id && this.interview.interview_date && this.interview.interviewer_id && 
        this.interview.link && this.interview.status && this.interview.result && this.interview.duration) {
      
      this.interviewService.createInterview(this.interview).subscribe(
        response => {
          console.log('Interview planned successfully:', response);
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "The Interview was successfully planned."
        },
        error => {
          console.error('Error planning interview:', error);
          this.typeAlert = 'danger';
          this.showAlert = true;
          this.error = error.error?.error || "There was an error with your interview's planification. Please try again.";
        }
      );
    } else {
      this.typeAlert = 'danger';
      this.showAlert = true;
      this.error = "Please fill all required fields."
    }
  }
}
