import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-candidate-show',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile-candidate-show.component.html',
  styleUrls: ['./profile-candidate-show.component.css']
})
export class ProfileCandidateShowComponent implements OnInit, OnChanges {
  profile: any = null;

  @Input() profileId!: number | null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    // Intentionally left empty — initialization is handled via ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profileId'] && this.profileId != null) {
      this.loadProfile(this.profileId);
    }
  }

  loadProfile(id: number): void {
    this.profileService.getProfileById(id).subscribe({
      next: (data: any) => {
        // Safely parse fields
        this.profile = {
          ...data,
          phone: this.formatPhone(data.phone),
          skills: this.safeParse(data.skills),
          experience: this.safeParse(data.experience),
          education: this.safeParse(data.education)
        };

        console.log('Parsed profile:', this.profile);
      },
      error: (err) => {
        console.error('Failed to load profile', err);
        this.profile = null;
      }
    });
  }

  /**
   * Safely parses JSON string fields, returns an empty array on failure.
   */
  private safeParse(value: any): any {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.warn('JSON parse failed for value:', value);
        return [];
      }
    }
    return value ?? [];
  }

  // If 00 is detected in the phone number replace it by +
  formatPhone(phone: string): string {
    if (phone.startsWith('00')) {
      return '+' + phone.slice(2).trim();
    }
    return phone;
  }
}
