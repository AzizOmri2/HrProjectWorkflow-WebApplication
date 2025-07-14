import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ApplicationService } from '../../../services/application.service';
import { InterviewService } from '../../../services/interview.service';
import { CommonModule } from '@angular/common';


declare var $: any;


@Component({
  selector: 'app-update-interview',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-interview.component.html',
  styleUrl: './update-interview.component.css'
})


export class UpdateInterviewComponent implements OnInit{
  userRole: string | null = null;
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
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }

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

    this.applicationService.getApplicationsNotWithdrawn().subscribe(data => {
      this.applications = data;
    });

    this.userService.getAllHR().subscribe(data =>{
      this.users = data;
    });
  }

  onSubmit() {      
    this.interviewService.updateInterview(this.interviewId,this.interview).subscribe(
      response => {
        this.typeAlert = 'success';
        this.error = "Your changes to the interview have been saved."
        $('#alertModal').modal('show');
      },
      error => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while updating the interview. Please review your data or try again later."
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
