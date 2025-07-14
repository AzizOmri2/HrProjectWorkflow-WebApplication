import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticleShowComponent } from '../article-show/article-show.component';


declare var $: any;


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

  articleIdToDelete: number | null = null;
  deleteMessage: string = 'Are you sure you want to delete this article?';
  typeAlert = '';
  alertMessage='';

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

  // Called from UI (when user clicks Delete button)
  deleteArticle(id: number) {
    this.articleIdToDelete = id;
    this.deleteMessage = 'Are you sure you want to delete this article?';
    $('#confirmDeleteModal').modal('show');
  }

  // Called when user confirms deletion
  confirmDelete() {
    if (this.articleIdToDelete !== null) {
      this.articleService.deleteArticle(this.articleIdToDelete).subscribe(
        () => {
          this.ArticlesList();
          this.articleIdToDelete = null;

          // Show success modal
          this.typeAlert = 'success';
          this.alertMessage = "The selected article was deleted successfully. The list has been updated accordingly.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
        },
        error => {
          this.typeAlert = 'danger';
          this.alertMessage = "The system encountered an issue while deleting the article. Please review your data or try again later.";
          $('#confirmDeleteModal').modal('hide');
          $('#alertModal').modal('show');
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

  ngAfterViewInit() {
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }
  }

}
