import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { OfferService } from '../../../services/offer.service';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-articles-list-front',
  imports: [CommonModule, RouterModule],
  templateUrl: './articles-list-front.component.html',
  styleUrl: './articles-list-front.component.css'
})
export class ArticlesListFrontComponent implements OnInit{

  articles:any;
  offers:any;
  offers_count: number = 0;
  isCandidateConnected: boolean = false;
  apps_count: number = 0;
  mes_apps: any;
  interviews_count: number = 0;

  userImage:any;
  userName:any;

  constructor(
    private articleService: ArticleService,
    private applicationService: ApplicationService,
    private offerService: OfferService,
    private router: Router, 
  ) {}

  ngOnInit(): void {
    // Check if candidate is authenticated
    const userData = localStorage.getItem('user_role');
    if (userData === 'candidate') {
      const userId = localStorage.getItem('user_id');
      this.userImage = localStorage.getItem('user_image');
      this.userName = localStorage.getItem('user_name') || "Candidate";

      if (userId) {
        this.applicationService.getApplicationsByCandidatId(userId).subscribe(
          application => {
            this.mes_apps = application || [];

            // Count Applications
            this.apps_count = this.mes_apps.length;

            // Count interviews
            this.interviews_count = this.mes_apps.filter((app: any) => app.status === 'Interviewed').length;

            console.log(this.mes_apps);
            console.log(this.apps_count);

            // If no applications, add a default one
            if (this.mes_apps.length === 0) {
              this.mes_apps = [
                {
                  job_offer: {
                    title: 'No Job Offer Yet',
                  },
                  status: 'Apply Now'
                }
              ];
            }
          },
          error => {
            console.error('Error fetching applications:', error);
          }
        );
      } else {
        console.error("User ID not found in localStorage");
      }

      this.isCandidateConnected = true;

    } else {
      // Default application for non-connected users
      this.mes_apps = [
        {
          job_offer: {
            title: 'Graphic Design',
          },
          status: 'Pending'
        }
      ];

      this.apps_count = 3;
      this.interviews_count = 2;
      this.userImage = "https://randomuser.me/api/portraits/men/81.jpg";
      this.userName = "John Doe";
    }

    

    // Display Articles
    this.articles = this.articleService.getAllArticles().subscribe(
      article => {
        this.articles = article
        console.log(this.articles);
      }
    );

    // Get All Offers
    this.offerService.getAllOffers().subscribe((offers) => {
      this.offers = offers.filter((offer: any) => offer.status === 'available');
      this.offers_count = this.offers.length;
      console.log(this.offers);
      console.log('Offers count:', this.offers_count);
    });
  }
}
