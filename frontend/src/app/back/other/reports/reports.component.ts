import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})

export class ReportsComponent implements OnInit{
  funnelData: any;
  conversionRates: any;
  
  diversityData: any;
  timeToHire: number = 0;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.reportsService.getFunnel().subscribe(data => {
      this.funnelData = [
        { label: 'Total Offers', count: data.total_offers },
        { label: 'Total Applications', count: data.total_applications },
        { label: 'Total Interviews', count: data.total_interviews },
        { label: 'Selected Candidates', count: data.selected_candidates }
      ];

      // Calculate conversion rates safely to avoid division by zero
      const apps = data.total_applications;
      const interviews = data.total_interviews;
      const offers = data.total_offers;
      const selected = data.selected_candidates;

      this.conversionRates = [
        {
          label: 'Applications → Interviews',
          rate: apps ? ((interviews / apps) * 100).toFixed(1) + '%' : 'N/A'
        },
        {
          label: 'Interviews → Offers',
          rate: interviews ? ((offers / interviews) * 100).toFixed(1) + '%' : 'N/A'
        },
        {
          label: 'Offers → Selected',
          rate: offers ? ((selected / offers) * 100).toFixed(1) + '%' : 'N/A'
        }
      ];
    });

    this.reportsService.getDiversity().subscribe(data => {
      this.diversityData = {
        gender: Object.entries(data.gender_distribution).map(([label, count]) => ({ label, count })),
        nationality: Object.entries(data.nationality_distribution).map(([label, count]) => ({ label, count })),
        age_group: Object.entries(data.age_distribution).map(([label, count]) => ({ label, count }))
      };
    });

    this.reportsService.getTimeToHire().subscribe((data: any) => {
      this.timeToHire = data['average_days_to_interview'];
    });
  }
}
