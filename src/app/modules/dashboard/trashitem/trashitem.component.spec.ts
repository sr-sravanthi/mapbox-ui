import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashitemComponent } from './trashitem.component';

describe('TrashitemComponent', () => {
  let component: TrashitemComponent;
  let fixture: ComponentFixture<TrashitemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrashitemComponent]
    });
    fixture = TestBed.createComponent(TrashitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
