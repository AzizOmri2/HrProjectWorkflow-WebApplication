import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';


declare var $: any;


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
  typeAlert = '';
  error='';

  constructor(
    private articleService: ArticleService
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
        this.typeAlert = 'success';
        this.error = "Your article has been submitted and recorded successfully."
        $('#alertModal').modal('show');
      },
      error => {
        this.typeAlert = 'danger';
        this.error = "The system encountered an issue while submitting your article. Please review your data or try again later."
        $('#alertModal').modal('show');
      }
    );
  }

  ngAfterViewInit() {
    $('#alertModal').on('hidden.bs.modal', () => {
      if (this.typeAlert === 'success') {
        window.location.reload();
      }
    });
  }
}
