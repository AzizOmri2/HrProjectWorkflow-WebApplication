import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApplicationService } from '../../../services/application.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './application-show.component.html',
  styleUrl: './application-show.component.css'
})
export class ApplicationShowComponent implements OnInit{
  applicationId!: number;
  application: any = {
    job_offer_id: '',
    candidat_id: '',
    cv_file: '',
    status: '',
    applied_at: ''
  };

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.applicationId) {
      this.applicationService.getApplicationById(this.applicationId).subscribe({
        next: data => {
          this.application = data;
        },
        error: err => {
          console.error('Error fetching Application', err);
        }
      });
    }
  }
}
