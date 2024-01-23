import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-mat-auto-complete',
  templateUrl: './mat-auto-complete.component.html',
  styleUrls: ['./mat-auto-complete.component.scss']
})
export class MatAutoCompleteComponent {

  @Input() searchFn!: (term: string) => Observable<any[]>; // Function to fetch data asynchronously
  @Input() displayFn!: (item: any) => string; // Function to display the selected item in the input
  @Output() selected = new EventEmitter<any>(); // Event emitted when an item is selected

  searchControl = new FormControl();
  searchResults: any[] = [];

  ngOnInit(): void {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Debounce for 300ms
      distinctUntilChanged(), // Only emit when the current value is different from the previous value
      switchMap(term => this.searchFn(term))
    ).subscribe(results => {
      this.searchResults = results;
    });
  }

  onItemSelected(item: any): void {
    this.selected.emit(item);
  }
}
