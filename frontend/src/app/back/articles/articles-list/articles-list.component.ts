import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../../../filter.pipe';
import { FormsModule } from '@angular/forms';
import { ArticleShowComponent } from '../article-show/article-show.component';

@Component({
  selector: 'app-articles-list',
  imports: [RouterModule, CommonModule, FormsModule, ArticleShowComponent],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit{
  userRole: string | null = null;
  articles:any;
  filteredArticles: any[] = [];

  filterText: string = '';
  showModal = false;
  selectedArticleId: number | null = null;

  constructor(private articleService: ArticleService, private router : Router){

  }

  ngOnInit(){
    // Retrieve the user Role from localStorage
    const roleUser = localStorage.getItem('user_role');
    if(roleUser){
      this.userRole = roleUser;
    } else {
      console.error('User Role not found in localStorage');
    }
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
    this.articleService.getAllArticles().subscribe(
      article => {
        this.articles = article;
        this.filteredArticles = [...this.articles]; // Initial state
        console.log(this.articles);
      },
      error => {
        console.error('Error fetching articles:', error);
      }
    );
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

  applyFilters() {
    this.filteredArticles = this.articles.filter((article: any) =>
      (this.filterText === '' ||
        article.title.toLowerCase().includes(this.filterText.toLowerCase()) ||
        article.content.toLowerCase().includes(this.filterText.toLowerCase()) ||
        article.author.name.toLowerCase().includes(this.filterText.toLowerCase())
      )
    );
  }

  resetFilters() {
    this.filterText = '';
    this.filteredArticles = [...this.articles];
  }

}
