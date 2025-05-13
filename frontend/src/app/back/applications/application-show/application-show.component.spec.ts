import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationShowComponent } from './application-show.component';

describe('ApplicationShowComponent', () => {
  let component: ApplicationShowComponent;
  let fixture: ComponentFixture<ApplicationShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
