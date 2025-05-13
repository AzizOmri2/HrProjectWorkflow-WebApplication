import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersListFrontComponent } from './offers-list-front.component';

describe('OffersListFrontComponent', () => {
  let component: OffersListFrontComponent;
  let fixture: ComponentFixture<OffersListFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersListFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
