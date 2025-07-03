import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainVideoContentComponent } from './main-video-content.component';

describe('MainVideoContentComponent', () => {
  let component: MainVideoContentComponent;
  let fixture: ComponentFixture<MainVideoContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainVideoContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainVideoContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
