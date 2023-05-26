import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateprivateroomComponent } from './createprivateroom.component';

describe('CreateprivateroomComponent', () => {
  let component: CreateprivateroomComponent;
  let fixture: ComponentFixture<CreateprivateroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateprivateroomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateprivateroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
