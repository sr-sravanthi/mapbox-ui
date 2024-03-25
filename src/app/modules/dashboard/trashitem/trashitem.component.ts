import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrashitemPopupComponent } from '../trashitem-popup/trashitem-popup.component';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { TrashService } from 'src/app/core/services/trash/trash.service';

@Component({
  selector: 'app-trashitem',
  templateUrl: './trashitem.component.html',
  styleUrls: ['./trashitem.component.scss']
})
export class TrashitemComponent implements OnInit {

  @Input("trashItem") trashItem: any;
  @Input("trashCategories") trashCategories: any[] = [];
  @Input("trashAttachmentUrl") trashAttachmentUrl: string = "";

  trashImg: string = "";
  trashcategory: string = '';

  constructor(public dialog: MatDialog, public mapboxService: MapboxService, public trashService: TrashService) { }

  ngOnInit(): void {
    //console.log(this.trashItem);
    
  
    let attachemnt = this.trashService.allTrashAttachmentData.filter((trash: any) => trash.trashId == this.trashItem.trashId);
    if (attachemnt.length > 0) {
      this.trashImg = this.trashService.getAttachmentUrl(attachemnt[0].fileName);
    }
    else {
      this.trashImg = "plastic.png"
    }

    // if (attachemnt[0]) {
    //   this.trashService.getAttachment(attachemnt[0].fileName).subscribe((res) => {
    //     if (res) {
    //       console.log(res);
    //       //trashImgUrl = this.trashService.getAttachmentUrl(attachemnt[0].fileName);
    //     }
    //   });
    // }

  }

  getTrashTypeName(trashItemId: any) {

    if (!this.trashCategories) {
      return undefined;
    }
    const correspondingTrashType = this.trashCategories.find((trash: any) => trash.id === trashItemId);
    return correspondingTrashType?.name;
  }

  trashPopup() {
    let dialogRef = this.dialog.open(TrashitemPopupComponent, {
      data: { ...this.trashItem, attachmentUrl: this.trashImg },
      width: '40%',
    });

  }


}