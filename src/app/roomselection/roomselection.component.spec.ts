import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomselectionComponent } from './roomselection.component';

describe('RoomselectionComponent', () => {
  let component: RoomselectionComponent;
  let fixture: ComponentFixture<RoomselectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomselectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
