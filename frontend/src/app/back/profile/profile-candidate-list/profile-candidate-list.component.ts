import { Component } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { RouterModule } from '@angular/router';
import { ProfileCandidateShowComponent } from '../profile-candidate-show/profile-candidate-show.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-candidate-list',
  imports: [CommonModule,RouterModule, ProfileCandidateShowComponent, FormsModule],
  templateUrl: './profile-candidate-list.component.html',
  styleUrls: ['./profile-candidate-list.component.css']
})
export class ProfileCandidateListComponent {
  profiles: any[] = [];
  selectedProfileId: number | null = null;
  showModal = false;
  filteredProfiles: any[] = [];

  searchText: string = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.profileService.getAllProfiles().subscribe((data) => {
      this.profiles = data.map(profile => ({
        ...profile,
        phone: this.formatPhone(profile.phone)
      }));
      this.filteredProfiles = [...this.profiles];  // copy for filtering
    });
  }

  formatPhone(phone: string): string {
    if (!phone) return phone; // safety check for null/undefined
    if (phone.startsWith('00')) {
      return '+' + phone.slice(2).trim();
    }
    return phone;
  }

  openProfileInfo(id: number) {
    this.selectedProfileId = id;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.showModal = false;
    this.selectedProfileId = null;
    document.body.style.overflow = 'auto';
  }


  applyFilters() {
    this.filteredProfiles = this.profiles.filter((profile: any) =>
      (this.searchText === '' ||
        profile.user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        profile.user.email.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  resetFilters(): void {
    this.searchText = '';
  }
}
