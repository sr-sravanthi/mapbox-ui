import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TRASH_CATEGORIES } from 'src/app/core/utilities/constants';
import { TrashitemComponent } from '../trashitem/trashitem.component';
import { UserDetails } from 'src/app/core/interfaces/user';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { WeatherComponent } from '../weather/weather.component';

@Component({
  selector: 'app-trashitem-popup',
  templateUrl: './trashitem-popup.component.html',
  styleUrls: ['./trashitem-popup.component.scss']
})

export class TrashitemPopupComponent implements OnInit {
  trashcategory: string = '';
  TRASH_CATEGORIES = TRASH_CATEGORIES;

  constructor(@Inject(MAT_DIALOG_DATA) public trashItem: any, public dialogRef: MatDialogRef<TrashitemComponent>, private trashService: TrashService,
    public mapboxService: MapboxService,public dialog: MatDialog) { }
  ngOnInit(): void {
   
  }

  clickOnRecovered() {
    let userDetails: UserDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

    if (!this.trashItem.isRecovered) {
      let saveRequestObj = {
        CommonEntity: {
          UserId: userDetails.userID
        },
        TrashList: [{
          TrashId: this.trashItem.trashId,
          TransactionId: this.trashItem.TransactionId,
          RecoveredDate: new Date().toISOString()

        }],
        AttachmentEntity: []
      }

      this.trashService.setRecoveredTrash(JSON.stringify(saveRequestObj)).subscribe(res => {
        console.log(res);
        this.mapboxService.searchTimestamp = null;
        this.trashService.refreshTrashData();
        //this.trashService.refreshTrashData();
        this.dialogRef.close();
      })
    }
  }
  closePopup() {
    this.dialogRef.close();
  }
  onclickweather(){
    let dialogRef = this.dialog.open(WeatherComponent, {
      data: this.trashItem,
      width: '40%',
    });
   
  }
}
