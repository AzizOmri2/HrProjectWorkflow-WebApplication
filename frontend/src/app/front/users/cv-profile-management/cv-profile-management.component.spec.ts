import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvProfileManagementComponent } from './cv-profile-management.component';

describe('CvProfileManagementComponent', () => {
  let component: CvProfileManagementComponent;
  let fixture: ComponentFixture<CvProfileManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvProfileManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
