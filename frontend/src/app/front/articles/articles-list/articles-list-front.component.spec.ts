import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesListFrontComponent } from './articles-list-front.component';

describe('ArticlesListComponent', () => {
  let component: ArticlesListFrontComponent;
  let fixture: ComponentFixture<ArticlesListFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesListFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
