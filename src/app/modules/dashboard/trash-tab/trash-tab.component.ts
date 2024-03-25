import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TrashService } from 'src/app/core/services/trash/trash.service';

@Component({
  selector: 'app-trash-tab',
  templateUrl: './trash-tab.component.html',
  styleUrls: ['./trash-tab.component.scss']
})
export class TrashTabComponent implements OnInit {
  @Input('tabName') tabName: any;
  @Input('trashData') trashData: any[] = [];
  @Input("trashCategories") trashCategories: any[] = [];
  @Input('attachmentData') trashAttachmentData: any[] = [];

  constructor(private trashService: TrashService) {

  }

  trashDataLength: number=0;
  isAscendingOrder: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (this.trashData && this.trashData.length > 0 && this.trashAttachmentData.length > 0) {
      if ((changes['tabName'] && changes['tabName']?.currentValue != changes['tabName'].previousValue) ||
        (changes['trashData'] && changes['trashData']?.currentValue != changes['trashData'].previousValue) ||
        (changes['trashAttachmentData'] && changes['trashAttachmentData']?.currentValue != changes['trashAttachmentData'].previousValue)) {
        this.isAscendingOrder = false;
      }
      this.trashDataLength = this.trashData.length;
      console.log(this.trashDataLength);
      
      this.toggleSortingOrder(this.tabName);
    }


  }

  ngOnInit() {
  }

  getAttachmentUrl(trashItem: any): string {
    let attachemnt = this.trashService.allTrashAttachmentData.filter((trash: any) => trash.trashId == trashItem.trashId);
    let trashImgUrl = "";
    if (attachemnt.length > 0) {
      trashImgUrl = this.trashService.getAttachmentUrl(attachemnt[0].fileName);
    }
    else {
      trashImgUrl = "plastic.png";
    }
    return trashImgUrl;
  }
  toggleSortingOrder(tabName: any): void {
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



