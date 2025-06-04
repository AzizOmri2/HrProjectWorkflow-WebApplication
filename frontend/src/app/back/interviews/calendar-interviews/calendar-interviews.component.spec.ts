import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarInterviewsComponent } from './calendar-interviews.component';

describe('CalendarInterviewsComponent', () => {
  let component: CalendarInterviewsComponent;
  let fixture: ComponentFixture<CalendarInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarInterviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
