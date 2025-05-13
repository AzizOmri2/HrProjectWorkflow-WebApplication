import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewsListComponent } from './interviews-list.component';

describe('InterviewsListComponent', () => {
  let component: InterviewsListComponent;
  let fixture: ComponentFixture<InterviewsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
