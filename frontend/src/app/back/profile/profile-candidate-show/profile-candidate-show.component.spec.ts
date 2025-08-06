import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCandidateShowComponent } from './profile-candidate-show.component';

describe('ProfileCandidateShowComponent', () => {
  let component: ProfileCandidateShowComponent;
  let fixture: ComponentFixture<ProfileCandidateShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileCandidateShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileCandidateShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
