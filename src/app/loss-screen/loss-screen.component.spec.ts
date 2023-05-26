import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossScreenComponent } from './loss-screen.component';

describe('LossScreenComponent', () => {
  let component: LossScreenComponent;
  let fixture: ComponentFixture<LossScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
