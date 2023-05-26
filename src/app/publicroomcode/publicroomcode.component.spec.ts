import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicroomcodeComponent } from './publicroomcode.component';

describe('PublicroomcodeComponent', () => {
  let component: PublicroomcodeComponent;
  let fixture: ComponentFixture<PublicroomcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicroomcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicroomcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
