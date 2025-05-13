import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferShowComponent } from './offer-show.component';

describe('OfferShowComponent', () => {
  let component: OfferShowComponent;
  let fixture: ComponentFixture<OfferShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
