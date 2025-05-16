import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';

@Component({
  selector: 'app-add-article',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './add-article.component.html',
  styleUrl: './add-article.component.css'
})
export class AddArticleComponent implements OnInit {
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
    private articleService: ArticleService, 
    private router:Router
  ) {}
  
  ngOnInit(): void {
    // Retrieve the user ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      this.article.author_id = userId;  // Assign to author_id
      this.article.nb_likes = 0; // Default value to nb_likes while created
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  // Handling file selection for article image
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(){
    this.showAlert = false;
    
    const formData = new FormData();
    formData.append('article[title]', this.article.title);
    formData.append('article[content]', this.article.content);
    formData.append('article[author_id]', this.article.author_id);
    formData.append('article[nb_likes]', this.article.nb_likes.toString());

    if (this.selectedFile) {
      formData.append('article[image]', this.selectedFile, this.selectedFile.name);
    }

    this.articleService.createArticle(formData).subscribe(
      response => {
        console.log('Article added successfully:', response);
        this.typeAlert = 'success';
        this.showAlert = true;
        this.error = "The Article was successfully added."
      },
      error => {
        console.error('Error adding article:', error);
        this.typeAlert = 'danger';
        this.showAlert = true;
        this.error = "The Article's creation was failed."
      }
    );
  }
}
