import { Component, Input, OnInit } from '@angular/core';
import { TRASH_CATEGORIES } from 'src/app/core/utilities/constats';
import { PopupComponent } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';

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
    let dialogRef = this.dialog.open(PopupComponent, {
      data:this.trashItem,
      width: '60%',
    });
    dialogRef.afterClosed().subscribe(result => {
     
    });

  }
}

