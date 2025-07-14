import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRestrictedComponent } from './age-restricted.component';

describe('AgeRestrictedComponent', () => {
  let component: AgeRestrictedComponent;
  let fixture: ComponentFixture<AgeRestrictedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeRestrictedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeRestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
