import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TRASH_CATEGORIES } from 'src/app/core/utilities/constants';
import { TrashitemComponent } from '../trashitem/trashitem.component';
import { UserDetails } from 'src/app/core/interfaces/user';
import { TrashService } from 'src/app/core/services/trash/trash.service';

@Component({
  selector: 'app-trashitem-popup',
  templateUrl: './trashitem-popup.component.html',
  styleUrls: ['./trashitem-popup.component.scss']
})

export class TrashitemPopupComponent implements OnInit {
  trashcategory: string = '';
  TRASH_CATEGORIES = TRASH_CATEGORIES;
  
constructor(@Inject(MAT_DIALOG_DATA) public trashItem: any, public dialogRef: MatDialogRef<TrashitemComponent>, private trashService: TrashService) { }
  ngOnInit(): void {
    console.log(this.trashItem);

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
        this.trashService.refreshTrashData();
        this.dialogRef.close();
      })
    }
  }
  closePopup() {
    this.dialogRef.close();
  }

}
