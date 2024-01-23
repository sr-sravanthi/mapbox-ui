import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashitemPopupComponent } from './trashitem-popup.component';

describe('TrashitemPopupComponent', () => {
  let component: TrashitemPopupComponent;
  let fixture: ComponentFixture<TrashitemPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrashitemPopupComponent]
    });
    fixture = TestBed.createComponent(TrashitemPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
