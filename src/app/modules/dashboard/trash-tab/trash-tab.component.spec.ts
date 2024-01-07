import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashTabComponent } from './trash-tab.component';

describe('TrashTabComponent', () => {
  let component: TrashTabComponent;
  let fixture: ComponentFixture<TrashTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrashTabComponent]
    });
    fixture = TestBed.createComponent(TrashTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
