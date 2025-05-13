import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProfileFrontComponent } from './update-profile-front.component';

describe('UpdateProfileFrontComponent', () => {
  let component: UpdateProfileFrontComponent;
  let fixture: ComponentFixture<UpdateProfileFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProfileFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProfileFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
