import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-trash-tab',
  templateUrl: './trash-tab.component.html',
  styleUrls: ['./trash-tab.component.scss']
})
export class TrashTabComponent implements OnInit {
  @Input('tabName') tabName: any;
  @Input('trashData') trashData: any;
  trashItemCount: number = 0;
  isAscendingOrder: boolean = true;
  ngOnChanges(changes: SimpleChanges): void {
    this.toggleSortingOrder();

  }

  ngOnInit() {

  }
  toggleSortingOrder(): void {
    if (this.trashData && this.trashData.length > 0) {
      if (this.isAscendingOrder) {
        this.trashData.sort(this.ascendingOrder);
      }
      else {
        this.trashData.sort(this.desendingOrder);
      }
    }
    this.isAscendingOrder = !this.isAscendingOrder;

  }
  ascendingOrder(a: any, b: any): number {
    const dateA = new Date(a.reportedDate).getTime();
    const dateB = new Date(b.reportedDate).getTime();
    return dateA - dateB;
  }
  desendingOrder(a: any, b: any): number {
    const dateA = new Date(a.reportedDate).getTime();
    const dateB = new Date(b.reportedDate).getTime();
    return dateB - dateA;
  }
}



