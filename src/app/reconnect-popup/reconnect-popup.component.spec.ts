import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconnectPopupComponent } from './reconnect-popup.component';

describe('ReconnectPopupComponent', () => {
  let component: ReconnectPopupComponent;
  let fixture: ComponentFixture<ReconnectPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconnectPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconnectPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
