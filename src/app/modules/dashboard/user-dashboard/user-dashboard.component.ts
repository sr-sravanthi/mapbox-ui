import { MapboxService } from './../../../core/services/mapbox.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AddtrashComponent } from '../addtrash/addtrash.component';
import { MatDialog } from '@angular/material/dialog';
import { DynamicComponentService } from 'src/app/core/services/dynamic-component-service/dynamic-component.service';
import { TrashRequest } from 'src/app/core/interfaces/trash';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MAPBOX_ZOOM } from 'src/app/core/utilities/constants';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  cornerCoordinates: any;
  trashCount: any;

  myTrash: any[] = [];
  allTrash: any[] = [];
  recoveredTrash: any[] = [];
  selectedTab: string = '';
  selectedTabTrashData: any[] = [];
  userCoordinates: any[] = [];
  trashDataForMap: any = [];
  filteredTrash: any[] = [];
  net: any[] = [];
  plastic: any[] = [];
  oil: any[] = [];
  constructor(public dialog: MatDialog, private authService: AuthService, private mapService: MapboxService) { }
  ngOnInit(): void {
    this.selectedTab = 'myTrash';

    this.mapService.currentMapBounds.subscribe((bounds) => {
      if (bounds) {
        let cornerCoords = this.mapService.getCornerCoordinates(bounds as mapboxgl.LngLatBounds)
        this.getTrashDetails(this.selectedTab, cornerCoords);
      }
    });

  }


  getTrashDetails(tabType: string, cornerCoords: any) {
    // let userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

    // if (!userDetails) {
    //   return
    // }
    const trash: TrashRequest = {
      //  userid:"userdetails.userID",
      userid: "hariharan31",
      timestamp: null,
      zoom: MAPBOX_ZOOM,
      ...cornerCoords
    };

    console.log(trash);

    this.authService.getAlltrash(trash).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.commonEntity.transactionStatus === "Y" && response.trashDetailsEntity.length > 0) {
          this.trashCount = response.trashDetailsEntity.length;
          this.allTrash = response.trashDetailsEntity;
          this.myTrash = response.trashDetailsEntity.filter((trash: any) => trash.isMyTrash === true);
          this.recoveredTrash = response.trashDetailsEntity.filter((trash: any) => trash.isRecovered === true);
          this.trashDataForMap = this.myTrash;
          // this.getTrashDataForMap(this.allTrash);
        }
      }
    });

  }


  onTrashTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.tab.textLabel;
    if (this.selectedTab === "My Trash") {
      this.selectedTabTrashData = this.myTrash;
      this.trashDataForMap = this.myTrash;
    }
    else if (this.selectedTab === "All Trash") {
      this.trashDataForMap = this.selectedTabTrashData = this.allTrash;
    }
    else if (this.selectedTab === "Recovered Trash") {
      this.trashDataForMap = this.selectedTabTrashData = this.recoveredTrash;
    }


    // this.getTrashDetails(tabType);

  }
  filterNet() {
    this.trashDataForMap = this.selectedTabTrashData.filter((trash: any) => trash.categoryId == 1);


  }
  filterPlastic() {
    this.trashDataForMap = this.selectedTabTrashData.filter((trash: any) => trash.categoryId == 2);
    console.log(this.plastic)
  }
  filterOil() {
    this.trashDataForMap = this.selectedTabTrashData.filter((trash: any) => trash.categoryId == 3);
    console.log(this.oil)
  }
  AddTrackClick() {
    const dialogRef = this.dialog.open(AddtrashComponent, {
      width: '60%',
      height: '95%'
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }
  search() { }
}
