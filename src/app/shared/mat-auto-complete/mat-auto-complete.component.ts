import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-mat-auto-complete',
  templateUrl: './mat-auto-complete.component.html',
  styleUrls: ['./mat-auto-complete.component.scss']
})
export class MatAutoCompleteComponent {

  @Input() optionData: any[] = [];
  @Input() optionKey: string = "";
  @Input() optionValue: string = "";


  @Input() customClass: string = "";
  @Input() label: string = "";

  @Output() optionSelectedValue = new EventEmitter();



  searchControl = new FormControl();
  filteredData: any[] = []

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredData = this.optionData;
    console.log(this.optionKey);
    console.log(this.optionValue);

  }
  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => { return this._filter(value || '') })
    ).subscribe();

  }


  private _filter(value: string) {
    console.log(value);

    if (this.optionData.length > 0 && value != "" && typeof (value) == "string") {
      const filterValue = value.toLowerCase();
      this.filteredData = this.optionData.filter((option: any) => option[this.optionKey].toLowerCase().includes(filterValue));
    }
    else {
      this.filteredData = this.optionData;
    }
    return this.filteredData;
  }

  onOptionSelected(event: any) {
    this.searchControl.setValue(event.option.value[this.optionKey]);
    this.optionSelectedValue.emit(event.option.value);

  }
}
