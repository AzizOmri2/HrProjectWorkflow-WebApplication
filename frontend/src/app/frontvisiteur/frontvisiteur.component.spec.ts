import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontvisiteurComponent } from './frontvisiteur.component';

describe('FrontvisiteurComponent', () => {
  let component: FrontvisiteurComponent;
  let fixture: ComponentFixture<FrontvisiteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontvisiteurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontvisiteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
