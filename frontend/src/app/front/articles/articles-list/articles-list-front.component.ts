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

  recommendedOffers: any[] = [];
  isLoadingRecommendations: boolean = false;
  recommendationErrorMessage: string | null = null;

  constructor(
    private articleService: ArticleService,
    private applicationService: ApplicationService,
    private offerService: OfferService
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

        // 🧠 NEW: Fetch recommended job offers for the candidate with caching
        const cacheKey = `recommended_offers_user_${userId}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          this.recommendedOffers = JSON.parse(cached);
          this.isLoadingRecommendations = false;
          console.log('Using cached recommendations from localStorage');
        } else {
          this.loadRecommendations(userId, cacheKey);
        }

      } else {
        console.error("User ID not found in localStorage");
      }

      this.isCandidateConnected = true;

    } else {
      // Default application for non-connected users
      this.mes_apps = [
        {
          job_offer: {
            title: 'Default Job',
          },
          status: 'APPLY NOW'
        }
      ];

      this.apps_count = 3;
      this.interviews_count = 2;
      this.userImage = "uploads/profile_pictures/default.jpg";
      this.userName = "John Doe";

      this.isCandidateConnected = false;
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

  private loadRecommendations(userId: string, cacheKey: string): void {
    this.isLoadingRecommendations = true;
    this.offerService.getRecommendedOffersForCandidate(+userId).subscribe({
      next: (offers) => {
        this.recommendedOffers = offers;
        this.isLoadingRecommendations = false;
        localStorage.setItem(cacheKey, JSON.stringify(offers));
      },
      error: (err) => {
        this.isLoadingRecommendations = false;

        if (err.status === 404 && err.error?.error === 'Profile not found') {
          this.recommendationErrorMessage = 'Your profile appears to be incomplete. To receive personalized job recommendations tailored to your skills and experience, please take a moment to complete your profile information. This will help us match you with the most relevant opportunities.';
        } else if (err.status === 429) {
          this.recommendationErrorMessage = 'Our system has received too many requests in a short period. Please wait a few moments before trying again. This helps ensure fair access for all users.';
        } else {
          this.recommendationErrorMessage = 'Failed to load recommended offers. Please try again later.';
        }

        // Clear recommendedOffers to trigger the no-recommendation UI
        this.recommendedOffers = [];
      }
    });
  }
}
