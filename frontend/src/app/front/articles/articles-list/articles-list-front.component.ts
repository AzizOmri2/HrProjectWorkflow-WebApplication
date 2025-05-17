import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-articles-list-front',
  imports: [CommonModule, RouterModule],
  templateUrl: './articles-list-front.component.html',
  styleUrl: './articles-list-front.component.css'
})
export class ArticlesListFrontComponent implements OnInit{

  articles:any;

  constructor(
    private articleService: ArticleService,
    private router: Router, 
  ) {}

  ngOnInit(): void {
    //Display Articles
    this.articles = this.articleService.getAllArticles().subscribe(
      article => {
        this.articles = article
        console.log(this.articles);
      }
    )
  }
}
