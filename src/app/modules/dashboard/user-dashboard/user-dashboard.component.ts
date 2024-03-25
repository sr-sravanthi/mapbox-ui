import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AddtrashComponent } from '../addtrash/addtrash.component';
import { MatDialog } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { TrashRequest } from 'src/app/core/interfaces/trash';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TrashService } from 'src/app/core/services/trash/trash.service';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { MasterData, TrashCatergory, UserType } from 'src/app/core/interfaces/common';
import { LocationStrategy } from '@angular/common';



@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  trashIcon: string[] = ["net-icon custom-sprite", "plastic custom-sprite", "oil-icon custom-sprite"];
  trashDataForMap: any;
  selectedTabTrashData: any[] = [];
  myTrash: any[] = [];
  allTrash: any[] = [];
  recoveredTrash: any[] = [];
  selectedTab: string = '';
  selectedCategoryFilter!: number;
  isFilterAppllied: boolean = false;
  allTrashAttachment: any[] = [];
  userDetails!: any;
  updatedtrash!: any;
  trashName: any;
  trashCategories: TrashCatergory[] = [];
  userTypes: UserType[] = [];
  tabNames = ["My Trash", "All Trash", "Recovered Trash"];


  constructor(public dialog: MatDialog, private authService: AuthService, private trashService: TrashService, private location: LocationStrategy
    , private mapboxService: MapboxService) { }

  ngOnInit(): void {

    this.authService.getMasterData().subscribe((data: MasterData) => {
      this.trashCategories = data.trashCategories;
    });
    this.selectedTab = "My Trash";
    this.getTrashForCurrentBounds();
    this.trashService.refreshTrashData$.subscribe((val) => {
      this.getTrashForCurrentBounds();
    })
  }

  getTrashForCurrentBounds() {
    this.mapboxService.currentmapBounds$.subscribe((bounds: any) => {
      if (bounds) {
        let cornerCoords = this.mapboxService.getCornerCordinates(bounds as mapboxgl.LngLatBounds);
        this.userDetails = this.authService.getUserId();
        this.getTrashDetails(this.selectedTab, cornerCoords);
      }
    });
  }

  getTrashDetails(tabType: string, cornerCoords: any) {

    const trash: TrashRequest = {
      userid: this.userDetails.userID,

      timestamp: this.mapboxService.searchTimestamp === null ? null : this.mapboxService.searchTimestamp?.toISOString(),
      zoom: this.mapboxService.currentMapZoom,
      ...cornerCoords

    };
    this.trashService.getAlltrash(trash).subscribe({
      next: (response: any) => {
        if (response.commonEntity.transactionStatus === "Y") {
          if (this.allTrash.length > 0) {
            if (response.trashDetailsEntity.length > 0) {
              this.mergelatestTrash(response.trashDetailsEntity, response.attachmentEntity);
            }
          }
          else {
            this.bindTrashTabData(response.trashDetailsEntity, response.attachmentEntity);
          }
        }

      }
    });
  }

  mergelatestTrash(latestTrashData: any[], attachmentData: any[]) {

    latestTrashData.forEach((newTrash: any) => {
      const existingIndex = this.allTrash.findIndex((trash: any) => trash.trashId === newTrash.trashId)
      if (existingIndex !== -1) {
        this.allTrash[existingIndex] = newTrash;
      } else {
        this.allTrash.push(newTrash);
      }
    });

    attachmentData.forEach((newTrashAttach: any) => {
      const existingIndex = this.allTrashAttachment.findIndex((trashAttach: any) => trashAttach.trashId === newTrashAttach.trashId)
      if (existingIndex !== -1) {
        this.allTrashAttachment[existingIndex] = newTrashAttach;
      } else {
        this.allTrashAttachment.push(newTrashAttach);
      }
    });

    this.bindTrashTabData(this.allTrash, this.allTrashAttachment);

  }

  bindTrashTabData(trashData: any, attachmentData: any[]) {

    this.allTrash = trashData;
    this.trashService.allTrashAttachmentData = attachmentData;
    this.myTrash = trashData.filter((trash: any) => trash.isMyTrash === true);
    this.recoveredTrash = trashData.filter((trash: any) => trash.isRecovered === true);
    this.getSelectedTabData();

  }

  onTrashTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.tab.textLabel;
    this.getSelectedTabData();

  }

  getSelectedTabData() {
    if (this.selectedTab === "My Trash") {
      this.selectedTabTrashData = this.myTrash;
      this.trashDataForMap = [...this.myTrash];

    }
    else if (this.selectedTab === "All Trash") {
      this.selectedTabTrashData = this.allTrash;
      this.trashDataForMap = [...this.allTrash];
    }
    else if (this.selectedTab === "Recovered Trash") {
      this.selectedTabTrashData = this.recoveredTrash;
      this.trashDataForMap = [...this.recoveredTrash];
    }
  }

  filterTrash(categoryId: number) {
    if (!this.isFilterAppllied) {
      this.isFilterAppllied = true;
      this.filterSelectedTrash(categoryId);

    }
    else if (this.selectedCategoryFilter !== categoryId) {
      this.isFilterAppllied = true;
      this.filterSelectedTrash(categoryId);
    }
    else {
      this.isFilterAppllied = false;
      this.trashDataForMap = [...this.selectedTabTrashData];
      this.selectedCategoryFilter = -1;
    }



  }

  filterSelectedTrash(categoryId: number) {
    this.selectedCategoryFilter = categoryId;

    let fitlerData = this.selectedTabTrashData.filter((trash: any) => trash.categoryId == categoryId);
    this.trashDataForMap = [...fitlerData];
  }


  AddTrashClick() {
    const dialogRef = this.dialog.open(AddtrashComponent, {
      width: '60%',
      height: '72%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.mapboxService.searchTimestamp = null;
        this.trashService.refreshTrashData();
        this.selectedTab = "My Trash";


      }
    });

  }


}
