import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtrashComponent } from './addtrash.component';

describe('AddtrashComponent', () => {
  let component: AddtrashComponent;
  let fixture: ComponentFixture<AddtrashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddtrashComponent]
    });
    fixture = TestBed.createComponent(AddtrashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
