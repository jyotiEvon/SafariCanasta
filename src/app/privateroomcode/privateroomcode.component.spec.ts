import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateroomcodeComponent } from './privateroomcode.component';

describe('PrivateroomcodeComponent', () => {
  let component: PrivateroomcodeComponent;
  let fixture: ComponentFixture<PrivateroomcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateroomcodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateroomcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
