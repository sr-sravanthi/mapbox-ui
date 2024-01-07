import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-trashitem',
  templateUrl: './trashitem.component.html',
  styleUrls: ['./trashitem.component.scss']
})
export class TrashitemComponent implements OnInit {

  @Input("trashItem") trashItem: any;
  ngOnInit(): void {
    console.log(this.trashItem)
  }

}
