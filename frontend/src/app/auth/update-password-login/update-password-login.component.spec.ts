import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordLoginComponent } from './update-password-login.component';

describe('UpdatePasswordLoginComponent', () => {
  let component: UpdatePasswordLoginComponent;
  let fixture: ComponentFixture<UpdatePasswordLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
