import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-article',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './update-article.component.html',
  styleUrl: './update-article.component.css'
})
export class UpdateArticleComponent implements OnInit{
  articleId!: number;
  article: any = {
    title: '',
    content: '',
    author_id: '',
    image: '',
    nb_likes: 0
  };
  selectedFile: File | null = null;
  showAlert = false;
  typeAlert = '';
  error='';

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router
  ) {}


  // Handling file selection for article image
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.articleId) {
      this.articleService.getArticleById(this.articleId).subscribe({
        next: data => {
          this.article = data;
        },
        error: err => {
          console.error('Error fetching article', err);
        }
      });
    }
  }

  onSubmit() {
    this.showAlert = false;

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
        console.log('Article updated successfully:', res);
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Article was successfully updated."
      },
      error: err => {
        console.error('Error updating article', err);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = "The Article's update was failed."
      }
    });
  }
}
