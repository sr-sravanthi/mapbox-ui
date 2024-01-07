import { Component, Input, OnInit } from '@angular/core';
import { TRASH_CATEGORIES } from 'src/app/core/utilities/constants';

@Component({
  selector: 'app-trashitem',
  templateUrl: './trashitem.component.html',
  styleUrls: ['./trashitem.component.scss'],
})
export class TrashitemComponent implements OnInit {
  @Input('trashItem') trashItem: any;
  trashCategory: string = '';

  TRASH_CATEGORIES = TRASH_CATEGORIES;

  ngOnInit(): void {
  }
}
