import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSupportPageComponent } from './help-support-page.component';

describe('HelpSupportPageComponent', () => {
  let component: HelpSupportPageComponent;
  let fixture: ComponentFixture<HelpSupportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpSupportPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpSupportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
