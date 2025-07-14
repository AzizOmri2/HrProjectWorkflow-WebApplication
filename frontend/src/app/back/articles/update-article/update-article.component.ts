import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


declare var $: any;


@Component({
  selector: 'app-update-article',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-article.component.html',
  styleUrl: './update-article.component.css'
})


export class UpdateArticleComponent implements OnInit{
  userId!: number;
  articleId!: number;
  article: any = {
    title: '',
    content: '',
    author_id: '',
    image: '',
    nb_likes: 0
  };
  selectedFile: File | null = null;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}


  // Handling file selection for article image
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.articleId = Number(this.route.snapshot.paramMap.get('id'));
      this.article.author_id = userId;  // Assign to author_id
      if (this.articleId) {
        this.articleService.getArticleById(this.articleId).subscribe({
          next: data => {
            this.article = data;
            if (!this.article.author_id) {
              this.article.author_id = userId;
            }
          },
          error: err => {
            console.error('Error fetching article', err);
          }
        });
      }
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('article[title]', this.article.title);
    formData.append('article[content]', this.article.content);
    formData.append('article[author_id]', this.article.author_id);
    formData.append('article[nb_likes]', this.article.nb_likes.toString());
    
    // Append the file to FormData
    if (this.selectedFile) {
      formData.append('article[image]', this.selectedFile, this.selectedFile.name);
    }

    this.articleService.updateArticle(this.articleId, formData).subscribe({
      next: res => {
        this.typeAlert = 'success';
        this.error = "Your changes to the article have been saved."
        $('#alertModal').modal('show');
      },
      error: err => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while updating the article. Please review your data or try again later."
        $('#alertModal').modal('show');
      }
    });
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
