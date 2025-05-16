import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-show',
  imports: [RouterModule, CommonModule],
  templateUrl: './article-show.component.html',
  styleUrl: './article-show.component.css'
})
export class ArticleShowComponent implements OnInit{
  articleId!: number;
  article: any = {
    title: '',
    content: '',
    author_id: '',
    image: '',
    nb_likes: 0
  };

  applications: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private router: Router
  ) {}

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
}
