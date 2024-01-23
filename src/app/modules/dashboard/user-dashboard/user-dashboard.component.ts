import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AddtrashComponent } from '../addtrash/addtrash.component';
import { MatDialog } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { TrashRequest } from 'src/app/core/interfaces/trash';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { MAP_ZOOM } from 'src/app/core/utilities/constants';
import { UserDetails } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  trashDataForMap: any;
  selectedTabTrashData: any[] = [];
  myTrash: any[] = [];
  allTrash: any[] = [];
  recoveredTrash: any[] = [];
  selectedTab: string = '';
  selectedCategoryFilter!: number;

  tabNames = ["My Trash", "All Trash", "Recovered Trash"];

  constructor(public dialog: MatDialog, private authService: AuthService, private trashService: TrashService,
    private mapboxService: MapboxService) { }

  ngOnInit(): void {
    this.selectedTab = "myTrash";
    this.mapboxService.currentmapBounds$.subscribe((bounds: any) => {
      if (bounds) {
        let cornerCoords = this.mapboxService.getCornerCordinates(bounds as mapboxgl.LngLatBounds);
        this.getTrashDetails(this.selectedTab, cornerCoords)
      }
    })
  }

  getTrashDetails(tabType: string, cornerCoords: any) {
    let userDetails!: UserDetails;
    if (sessionStorage.getItem("userDetails")) {
      userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
    }
    if (!userDetails) {
      return
    }
    const trash: TrashRequest = {
      //userid:"userdetails.userID",
      userid: "hariharan31",
      timestamp: this.mapboxService.searchTimestamp === null ? null : this.mapboxService.searchTimestamp.toISOString(),
      zoom: MAP_ZOOM,
      ...cornerCoords

    };
    console.log(trash);
    this.trashService.getAlltrash(trash).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.commonEntity.transactionStatus === "Y" && response.trashDetailsEntity.length > 0) {

          this.allTrash = response.trashDetailsEntity;
          this.myTrash = response.trashDetailsEntity.filter((trash: any) => trash.isMyTrash === true);
          console.log(this.myTrash)
          this.recoveredTrash = response.trashDetailsEntity.filter((trash: any) => trash.isRecovered === true);

          this.selectedTabTrashData = this.myTrash;
          this.trashDataForMap = this.myTrash;
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
      this.selectedTabTrashData = this.trashDataForMap = this.allTrash;
    }
    else if (this.selectedTab === "Recovered Trash") {
      this.selectedTabTrashData = this.trashDataForMap = this.recoveredTrash;
    }


  }

  filterTrash(categoryId: number) {
    this.selectedCategoryFilter = categoryId;
    this.trashDataForMap = this.selectedTabTrashData.filter((trash: any) => trash.categoryId == categoryId);

  }

  AddTrashClick() {
    const dialogRef = this.dialog.open(AddtrashComponent, {
      width: '60%',
      height: '72%'
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

}
