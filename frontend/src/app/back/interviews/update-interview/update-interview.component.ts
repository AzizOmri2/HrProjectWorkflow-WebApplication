import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-interview',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-interview.component.html',
  styleUrl: './update-interview.component.css'
})
export class UpdateInterviewComponent implements OnInit{
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
    private userService: UserService, 
    private applicationService: ApplicationService, 
    private interviewService: InterviewService
  ) {}

  applications: any[] = [];
  users: any;


  ngOnInit(): void {
    this.interviewId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.interviewId) {
      this.interviewService.getInterviewById(this.interviewId).subscribe({
        next: data => {
          // Format the date to 'YYYY-MM-DDTHH:mm'
          const date = new Date(data.interview_date);
          data.interview_date = date.toISOString().slice(0, 16); // keeps only 'YYYY-MM-DDTHH:mm'
          
          this.interview = data;
        },
        error: err => {
          console.error('Error fetching interview', err);
        }
      });
    }

    this.applicationService.getAllApplications().subscribe(data => {
      this.applications = data;
    });

    this.userService.getAllHR().subscribe(data =>{
      this.users = data;
    });
  }

  onSubmit() {
    this.showAlert = false;
    // Ensure interview is valid before submission
    if (this.interview.application_id && this.interview.interview_date && this.interview.interviewer_id && 
        this.interview.link && this.interview.status && this.interview.result && this.interview.duration) {
      
      this.interviewService.updateInterview(this.interviewId,this.interview).subscribe(
        response => {
          console.log('Interview update successfully:', response);
          this.typeAlert = 'success';
          this.showAlert = true;
          this.error = "The Interview was successfully updated."
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
