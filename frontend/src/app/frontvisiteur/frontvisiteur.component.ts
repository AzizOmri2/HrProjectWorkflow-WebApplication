import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-frontvisiteur',
  imports: [CommonModule, RouterModule],
  templateUrl: './frontvisiteur.component.html',
  styleUrl: './frontvisiteur.component.css'
})
export class FrontvisiteurComponent implements OnInit{
  pageTitle = 'Home';
  breadcrumb = 'Home';

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
  ) {}

  

  ngOnInit(): void {
    // 🔥 Update title on initial load
    this.updatePageTitle(this.activatedRoute);

    // 🔁 Update title on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle(this.activatedRoute);
      });
  }


  // Helper to get deepest route and set title/breadcrumb
  private updatePageTitle(route: ActivatedRoute) {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    const data = child.snapshot.data;
    this.pageTitle = data['title'] || 'Home';
    this.breadcrumb = data['breadcrumb'] || 'Home';
  }
}
