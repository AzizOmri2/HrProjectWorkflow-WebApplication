import { Component, OnInit } from '@angular/core';
import { CvUploadService } from '../../../services/cv-upload.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-profile-management',
  imports: [JsonPipe, CommonModule, FormsModule],
  templateUrl: './cv-profile-management.component.html',
  styleUrls: ['./cv-profile-management.component.css']
})
export class CvProfileManagementComponent implements OnInit {
  selectedFile: File | null = null;
  uploadResult: any = null;
  profile: any = null;

  constructor(private cvUploadService: CvUploadService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  uploadCv(): void {
    if (!this.selectedFile) return;

    this.cvUploadService.uploadCv(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadResult = res;
        this.loadProfile();
      },
      error: (err) => {
        this.uploadResult = err.error || err.message;
      }
    });
  }

  loadProfile(): void {
    this.cvUploadService.getProfile().subscribe({
      next: (res: any) => {
        if (res.profile) {
          this.profile = {
            ...res.profile,
            skills: this.parseJsonField(res.profile.skills),
            experience: this.parseJsonField(res.profile.experience),
            education: this.parseJsonField(res.profile.education),
          };
        } else {
          this.profile = null;
        }
      },
      error: () => {
        this.profile = null;
      }
    });
  }

  saveProfile(): void {
    if (!this.profile) return;

    const profileToSave = {
      ...this.profile,
      skills: this.profile.skills,
      experience: this.profile.experience.map((exp: any) => ({
        ...exp,
        description: Array.isArray(exp.description) ? exp.description : exp.description?.split('\n') || [],
        keywords: exp.keywords || []
      })),
      education: this.profile.education,
    };

    this.cvUploadService.updateProfile(profileToSave).subscribe({
      next: () => {
        alert('Profile saved successfully!');
        this.loadProfile();
      },
      error: (err) => {
        alert('Failed to save profile: ' + (err.error || err.message));
      }
    });
  }

  addSkill(): void {
    if (!this.profile.skills) this.profile.skills = [];
    this.profile.skills.push('');
  }

  removeSkill(index: number): void {
    this.profile.skills.splice(index, 1);
  }

  addExperience(): void {
    if (!this.profile.experience) this.profile.experience = [];
    this.profile.experience.push({
      title: '',
      company: '',
      dates: '',
      location: '',
      description: [],
      keywords: []
    });
  }

  removeExperience(index: number): void {
    this.profile.experience.splice(index, 1);
  }

  updateKeywords(event: Event, index: number): void {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    this.profile.experience[index].keywords = input.value
      .split(',')
      .map((kw) => kw.trim());
  }

  addEducation(): void {
    if (!this.profile.education) this.profile.education = [];
    this.profile.education.push({
      degree: '',
      institution: '',
      dates: ''
    });
  }

  removeEducation(index: number): void {
    this.profile.education.splice(index, 1);
  }

  private parseJsonField(field: string | null): any[] {
    try {
      return field ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  }
}
