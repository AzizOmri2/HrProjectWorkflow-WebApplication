import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articles-list',
  imports: [RouterModule, CommonModule, FilterPipe, FormsModule],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit{
  articles:any;
  actionText: string = 'Sort By';
  searchText: string = '';

  constructor(private articleService: ArticleService, private router : Router){

  }

  ngOnInit(){
    this.ArticlesList()
  }

  ArticlesList(){
    this.articles = this.articleService.getAllArticles().subscribe(
      article => {
        this.articles = article
        console.log(this.articles);
      }
    )
  }

  // Delete article
  deleteArticle(id: number) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(id).subscribe(
        () => {
          // Refresh the article list after deletion
          this.ngOnInit();
        },
        error => {
          console.error('Error deleting article:', error);
        }
      );
    }
  }

  setActionText(text: string) {
    this.actionText = text;
  }
}
