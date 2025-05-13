import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApplicationFrontComponent } from './add-application-front.component';

describe('AddApplicationFrontComponent', () => {
  let component: AddApplicationFrontComponent;
  let fixture: ComponentFixture<AddApplicationFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddApplicationFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApplicationFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
