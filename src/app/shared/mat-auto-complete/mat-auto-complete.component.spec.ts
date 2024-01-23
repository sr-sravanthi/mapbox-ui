import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAutoCompleteComponent } from './mat-auto-complete.component';

describe('MatAutoCompleteComponent', () => {
  let component: MatAutoCompleteComponent;
  let fixture: ComponentFixture<MatAutoCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatAutoCompleteComponent]
    });
    fixture = TestBed.createComponent(MatAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
