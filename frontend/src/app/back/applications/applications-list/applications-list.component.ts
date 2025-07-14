import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationShowComponent } from '../application-show/application-show.component';


declare var $: any;


@Component({
  selector: 'app-applications-list',
  imports: [RouterModule,CommonModule,FormsModule, ApplicationShowComponent],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css'
})


export class ApplicationsListComponent implements OnInit{
  userRole: string | null = null;
  applications: any[] = [];
  filteredApplications: any[] = [];
  filterText: string = '';
  selectedStatus: string = '';

  selectedApplicationId: number | null = null;

  showModal = false;

  applicationIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this application?';
  typeAlert = '';
  alertMessage='';


  constructor(private applicationService: ApplicationService, private router: Router) {}

  ngOnInit() {
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
    this.getApplicationsList();
  }

  getApplicationsList() {
    this.applicationService.getAllApplications().subscribe(
      (application: any[]) => {
        this.applications = application;
        this.filteredApplications = [...this.applications]; // initialize filtered list
        console.log(this.applications);
      },
      error => {
        console.error('Error fetching applications:', error);
      }
    );
  }

  openApplicationInfo(applicationId: number) {
    this.selectedApplicationId = applicationId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.selectedApplicationId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  // Called from UI (when user clicks Delete button)
  deleteApplication(id: number) {
    this.applicationIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this application?';
    $('#confirmDeleteModal').modal('show');
  }

  // Called when user confirms deletion
  confirmDelete() {
    if (this.applicationIdToDelete !== null) {
      this.applicationService.deleteApplication(this.applicationIdToDelete).subscribe(
        () => {
          this.getApplicationsList();
          this.applicationIdToDelete = null;

          // Show success modal
          this.typeAlert = 'success';
          this.alertMessage = "The selected application was deleted successfully. The list has been updated accordingly.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "The system encountered an issue while deleting the application. Please review your data or try again later.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        }
      );
    }
  }

  // Method to download the CV as PDF
  downloadCv(id: number, candidate_name: string) {
    this.applicationService.downloadPdf(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const safeName = candidate_name.trim().replace(/\s+/g, '_');
        link.download = `cv_${safeName}_${id}_HRProjectWorkFlow_2025.pdf`;
        link.click();
      },
      (error) => {
        console.error('Error downloading the file', error);
      }
    );
  }

  applyFilters() {
    const filter = this.filterText.toLowerCase();

    this.filteredApplications = this.applications.filter((application: any) => {
      const appliedDate = new Date(application.applied_at)
        .toISOString()
        .slice(0, 16) // 'yyyy-MM-ddTHH:mm'
        .replace('T', ' ')
        .toLowerCase();

      const matchesText =
        !this.filterText ||
        application.job_offer?.title?.toLowerCase().includes(filter) ||
        application.job_offer?.location?.toLowerCase().includes(filter) ||
        application.candidate?.name?.toLowerCase().includes(filter) ||
        application.status?.toLowerCase().includes(filter) ||
        appliedDate.includes(filter);

      const matchesStatus =
        !this.selectedStatus || application.status === this.selectedStatus;

      return matchesText && matchesStatus;
    });
  }

  resetFilters() {
    this.filterText = '';
    this.selectedStatus = '';
    this.filteredApplications = [...this.applications];
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
