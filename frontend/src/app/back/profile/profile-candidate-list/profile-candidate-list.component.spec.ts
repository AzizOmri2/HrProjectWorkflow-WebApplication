import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCandidateListComponent } from './profile-candidate-list.component';

describe('ProfileCandidateListComponent', () => {
  let component: ProfileCandidateListComponent;
  let fixture: ComponentFixture<ProfileCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCandidateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
