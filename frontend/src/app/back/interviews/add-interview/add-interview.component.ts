import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

declare var $: any;


@Component({
  selector: 'app-add-interview',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './add-interview.component.html',
  styleUrl: './add-interview.component.css'
})


export class AddInterviewComponent implements OnInit{
  userRole: string | null = null;
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
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
    
    this.applicationService.getApplicationsNotWithdrawn().subscribe(data => {
      this.applications = data;
    });

    this.userService.getAllHR().subscribe(data =>{
      this.users = data;
    });
    this.interview.status = 'Scheduled';
    this.interview.result = 'Pending';
  }

  onSubmit() {      
    this.interviewService.createInterview(this.interview).subscribe(
      response => {
        console.log('Interview planned successfully:', response);
        this.typeAlert = 'success';
        this.error = "Your Interview has been submitted and recorded successfully."
        $('#alertModal').modal('show');
      },
      error => {
        console.error('Error planning interview:', error);
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while submitting your interview. Please review your data or try again later."
        $('#alertModal').modal('show');
      }
    );
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
