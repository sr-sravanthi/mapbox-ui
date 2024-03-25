import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime,map, startWith} from 'rxjs';

@Component({
  selector: 'app-mat-auto-complete',
  templateUrl: './mat-auto-complete.component.html',
  styleUrls: ['./mat-auto-complete.component.scss']
})
export class MatAutoCompleteComponent implements OnInit {


  @Input() optionData: any[] = [];
  @Input() optionKey: string = "";
  @Input() optionValue: string = "";


  @Input() customClass: string = "";
  @Input() label: string = "";
  @Input() initialVal: any;

  @Output() optionSelectedValue = new EventEmitter();



  searchControl = new FormControl();
  filteredData: any[] = []

  ngOnChanges(changes: SimpleChanges): void {
    this.filteredData = this.optionData;
    if (this.initialVal && this.optionData && this.optionData?.length > 0) {
      let val: any = this.optionData.find((x) => x[this.optionValue] == this.initialVal)
      this.searchControl.setValue(val[this.optionKey])

    }

  }
  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => { return this._filter(value || '') })
    ).subscribe();

  }


  private _filter(value: string) {
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
