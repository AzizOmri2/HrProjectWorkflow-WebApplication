import { Component, OnInit } from '@angular/core';
import { CvUploadService } from '../../../services/cv-upload.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-profile-management',
  imports: [CommonModule, FormsModule], //JsonPipe
  templateUrl: './cv-profile-management.component.html',
  styleUrls: ['./cv-profile-management.component.css']
})
export class CvProfileManagementComponent implements OnInit {
  selectedFile: File | null = null;
  uploadResult: any = null;
  profile: any = null;

  isLoadingUploadCV = false;
  result: any;

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

    this.isLoadingUploadCV = true;
    this.result = null;

    this.cvUploadService.uploadCv(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadResult = res;
        this.result = 'success';
        this.loadProfile();

        setTimeout(() => this.result = null, 6000);
      },
      error: (err) => {
        if (err.status === 429) {
          // Specific message for rate limit error
          this.uploadResult = 'Too many requests. Please wait a few minutes and try again.';
        } else {
          this.uploadResult = err.error || err.message;
        }
        this.result = 'failed';
        this.isLoadingUploadCV = false;

        setTimeout(() => this.result = null, 6000);
      }
    });
  }

  loadProfile(): void {
    this.cvUploadService.getProfile().subscribe({
      next: (res: any) => {
        if (res.profile) {
          const parsedProfile = {
            ...res.profile,
            skills: this.parseJsonField(res.profile.skills),
            experience: this.parseJsonField(res.profile.experience),
            education: this.parseJsonField(res.profile.education),
          };

          // Normalize experience
          parsedProfile.experience = parsedProfile.experience.map((exp: any) => {
            if (!exp.title && exp.role) {
              exp.title = exp.role;
            }
            if (!exp.dates && exp.duration) {
              exp.dates = exp.duration;
            }
            if (!exp.description && exp.details) {
              exp.description = exp.details;
            }
            if (typeof exp.description === 'string') {
              exp.description = exp.description.split('\n');
            } else if (!Array.isArray(exp.description)) {
              exp.description = [];
            }
            exp.descriptionText = exp.description.join('\n');
            return exp;
          });

          // Normalize education
          parsedProfile.education = parsedProfile.education.map((edu: any) => {
            if (!edu.dates && edu.duration) {
              edu.dates = edu.duration;
            }
            return edu;
          });

          this.profile = parsedProfile;
          console.log('✅ Parsed Experience:', parsedProfile.experience);
          console.log('✅ Parsed Education:', parsedProfile.education);
        } else {
          this.profile = null;
        }

        this.isLoadingUploadCV = false;
      },
      error: () => {
        this.profile = null;
        this.isLoadingUploadCV = false;
      }
    });
  }

  saveProfile(): void {
    if (!this.profile) return;

    const profileToSave = {
      ...this.profile,
      skills: this.profile.skills,
      experience: this.profile.experience.map((exp: any) => ({
        title: exp.title || exp.role || '',
        company: exp.company || '',
        dates: exp.dates || '',
        location: exp.location || '',
        description: exp.descriptionText ? exp.descriptionText.split('\n') : [],
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
