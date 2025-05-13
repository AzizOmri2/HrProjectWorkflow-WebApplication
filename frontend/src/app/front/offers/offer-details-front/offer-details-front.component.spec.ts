import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailsFrontComponent } from './offer-details-front.component';

describe('OfferDetailsFrontComponent', () => {
  let component: OfferDetailsFrontComponent;
  let fixture: ComponentFixture<OfferDetailsFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferDetailsFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailsFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
