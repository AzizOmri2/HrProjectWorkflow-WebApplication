import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackHrComponent } from './back-hr.component';

describe('BackHrComponent', () => {
  let component: BackHrComponent;
  let fixture: ComponentFixture<BackHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackHrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
