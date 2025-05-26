import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInterviewsComponent } from './mes-interviews.component';

describe('MesInterviewsComponent', () => {
  let component: MesInterviewsComponent;
  let fixture: ComponentFixture<MesInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesInterviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
