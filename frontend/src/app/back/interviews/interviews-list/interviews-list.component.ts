import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewShowComponent } from '../interview-show/interview-show.component';

declare var $: any;


@Component({
  selector: 'app-interviews-list',
  imports: [RouterModule,CommonModule, FormsModule, InterviewShowComponent],
  templateUrl: './interviews-list.component.html',
  styleUrl: './interviews-list.component.css'
})


export class InterviewsListComponent implements OnInit{
  userRole: string | null = null;
  filterText: string = '';
  selectedStatus: string = '';
  selectedResult: string = '';
  interviews: any[] = []; // Your original interview list
  filteredInterviews: any[] = [];

  selectedInterviewId: number | null = null;

  showModal = false;

  interviewIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this interview?';
  typeAlert = '';
  alertMessage='';


  constructor(
    private interviewService: InterviewService
  ){}

  ngOnInit(){
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
    this.InterviewsList()
  }

  InterviewsList(){
    this.interviewService.getAllInterviews().subscribe(
      (interview: any[]) => {
        this.interviews = interview;
        this.filteredInterviews = [...this.interviews]; // initialize filtered list
        console.log(this.interviews);
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  openInterviewInfo(interviewId: number) {
    this.selectedInterviewId = interviewId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  reloadModal() {
    const currentId = this.selectedInterviewId;

    // Temporarily clear the selectedInterviewId so the component is removed
    this.selectedInterviewId = null;

    // Then reassign the id after a short delay (to trigger re-creation)
    setTimeout(() => {
      this.selectedInterviewId = currentId;
    }, 0);
  }

  closeModal() {
    this.selectedInterviewId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  // Called from UI (when user clicks Delete button)
  deleteInterview(id: number) {
    this.interviewIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this interview?';
    $('#confirmDeleteModal').modal('show');
  }

  // Called when user confirms deletion
  confirmDelete() {
    if (this.interviewIdToDelete !== null) {
      this.interviewService.deleteInterview(this.interviewIdToDelete).subscribe(
        () => {
          this.InterviewsList();
          this.interviewIdToDelete = null;

          // Show success modal
          this.typeAlert = 'success';
          this.alertMessage = "The selected interview was deleted successfully. The list has been updated accordingly.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "The system encountered an issue while deleting the interview. Please review your data or try again later.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        }
      );
    }
  }


  applyFilters() {
    this.filteredInterviews = this.interviews.filter((interview: any) =>
      (this.filterText === '' ||
        interview.application.job_offer.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.application.job_offer.location.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.application.candidate.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.interviewer.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.status?.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.result?.toLowerCase().includes(this.filterText.toLowerCase()) ||
        (interview.duration?.toString().toLowerCase().includes(this.filterText.toLowerCase())) ||
        (interview.interview_date?.toString().toLowerCase().includes(this.filterText.toLowerCase()))
      ) &&
      (this.selectedStatus === '' || interview.status === this.selectedStatus) &&
      (this.selectedResult === '' || interview.result === this.selectedResult)
    );
  }

  resetFilters() {
    this.filterText = '';
    this.selectedStatus = '';
    this.selectedResult = '';
    this.filteredInterviews = [...this.interviews];
  }

  ngAfterViewInit() {
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }
}
