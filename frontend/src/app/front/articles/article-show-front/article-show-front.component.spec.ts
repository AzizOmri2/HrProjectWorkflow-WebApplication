import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleShowFrontComponent } from './article-show-front.component';

describe('ArticleShowFrontComponent', () => {
  let component: ArticleShowFrontComponent;
  let fixture: ComponentFixture<ArticleShowFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleShowFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleShowFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
