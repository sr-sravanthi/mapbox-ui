import { TRASH_CATEGORIES } from 'src/app/core/utilities/constats';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  trashcategory: string = '';
  TRASH_CATEGORIES = TRASH_CATEGORIES;

  //@Input("trashData") trashData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public trashItem: any, public dialogRef: MatDialogRef<PopupComponent>) { }
  ngOnInit(): void {
    console.log(this.trashItem);

  }

  closePopup(){
    this.dialogRef.close();
  }
}
