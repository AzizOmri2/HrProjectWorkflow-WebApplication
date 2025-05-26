import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';
import { ArticleShowComponent } from '../article-show/article-show.component';

@Component({
  selector: 'app-articles-list',
  imports: [RouterModule, CommonModule, FilterPipe, FormsModule, ArticleShowComponent],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit{
  articles:any;
  searchText: string = '';
  showModal = false;
  selectedArticleId: number | null = null;

  constructor(private articleService: ArticleService, private router : Router){

  }

  ngOnInit(){
    this.ArticlesList()
  }

  openArticleInfo(articleId: number) {
    this.selectedArticleId = articleId;
    this.showModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeModal() {
    this.selectedArticleId = null;
    this.showModal = false;
    document.body.style.overflow = 'auto';
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

  resetFilters(): void {
    this.searchText = '';
  }

}
