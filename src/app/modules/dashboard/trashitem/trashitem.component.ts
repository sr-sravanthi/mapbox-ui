import { Component, Inject, Input, OnInit } from '@angular/core';
import { TRASH_CATEGORIES } from 'src/app/core/utilities/constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TrashitemPopupComponent } from '../trashitem-popup/trashitem-popup.component';

@Component({
  selector: 'app-trashitem',
  templateUrl: './trashitem.component.html',
  styleUrls: ['./trashitem.component.scss']
})
export class TrashitemComponent implements OnInit {

  @Input("trashItem") trashItem: any;
  trashcategory: string = '';
  TRASH_CATEGORIES = TRASH_CATEGORIES;
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
  }
  trashPopup() {
    let dialogRef = this.dialog.open(TrashitemPopupComponent, {
      data: this.trashItem,
      width: '40%',
    });




  }
}

