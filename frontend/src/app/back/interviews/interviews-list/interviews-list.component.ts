import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../services/interview.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InterviewShowComponent } from '../interview-show/interview-show.component';

@Component({
  selector: 'app-interviews-list',
  imports: [RouterModule,CommonModule, FormsModule, InterviewShowComponent],
  templateUrl: './interviews-list.component.html',
  styleUrl: './interviews-list.component.css'
})
export class InterviewsListComponent implements OnInit{
  filterText: string = '';
  selectedStatus: string = '';
  selectedResult: string = '';
  interviews: any[] = []; // Your original interview list
  filteredInterviews: any[] = [];

  selectedInterviewId: number | null = null;

  showModal = false;


  constructor(private interviewService: InterviewService, private router : Router){

  }

  ngOnInit(){
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


  applyFilters() {
    this.filteredInterviews = this.interviews.filter((interview: any) =>
      (this.filterText === '' ||
        interview.application.job_offer.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        interview.application.job_offer.company.toLowerCase().includes(this.filterText.toLowerCase()) ||
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
}
