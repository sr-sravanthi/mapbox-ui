import { TRASH_CATEGORIES } from 'src/app/core/utilities/constats';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { AddtrashComponent } from '../addtrash/addtrash.component';
import { MatDialog } from '@angular/material/dialog';
import * as mapboxgl from 'mapbox-gl';
import { environment } from "src/environments/environment.development";
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { DynamicComponentService } from 'src/app/core/services/dynamic-component-service/dynamic-component.service';
import { UserDetails, UserRequest } from 'src/app/core/interfaces/user';
import { TrashRequest } from 'src/app/core/interfaces/trash';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  cornerCoordinates: any;
  trashCount: any;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/msuteu/cllnjn3u5001f01pe07y3e03b';
  lat = -74.5;
  lng = 40;
  zoom = 13;
  popup!: mapboxgl.Popup;
  myTrash: any[] = [];
  allTrash: any[] = [];
  recoveredTrash: any[] = [];
  selectedTab: string = '';
  userCoordinates:any[]=[];
  net:any[]=[];
  plastic:any[]=[];
  oil:any[]=[];
  constructor(public dialog: MatDialog, private dynamic: DynamicComponentService, private authService: AuthService) { }
  ngOnInit(): void {
    this.addMap();
    this.selectedTab = 'myTrash';

  }
  addMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
    const locateUser = new mapboxgl.GeolocateControl({
      showAccuracyCircle: false,
      showUserLocation: true,
      positionOptions: {
        enableHighAccuracy: true,
      },

    });
    this.map.addControl(locateUser, 'bottom-right')

    locateUser.on('geolocate', (e: any) => {
      console.log(e);
      let userCoordinates = new mapboxgl.LngLat(
        e.coords.longitude,
        e.coords.latitude
      );
      console.log(userCoordinates);
    });
    this.map.on('load', () => {
      locateUser.trigger();
      this.getCornerCoordinates();

    });
  }
  getCornerCoordinates() {
    const bounds = this.map.getBounds();
    console.log(this.map.getCenter());
    const southwest = bounds.getSouthWest();
    const southeast = bounds.getSouthEast();
    const northeast = bounds.getNorthEast();
    const northwest = bounds.getNorthWest();
    this.cornerCoordinates = { southwest, southeast, northeast, northwest };
    this.getTrashDetails(this.selectedTab);

  }
 

  getTrashDetails(tabType: string) {
    let userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

    if (!userDetails) {
      return
    }
    const trash: TrashRequest = {
      //  userid:"userdetails.userID",
      userid: "hariharan31",
      timestamp: null,
      nELatitude: this.cornerCoordinates.northeast[1],
      nWLatitude: this.cornerCoordinates.northwest[1],
      sELatitude: this.cornerCoordinates.southeast[1],
      sWLatitude: this.cornerCoordinates.southwest[1],
      nELongitude: this.cornerCoordinates.northeast[0],
      nWLongitude: this.cornerCoordinates.northwest[0],
      sELongitude: this.cornerCoordinates.southeast[0],
      sWLongitude: this.cornerCoordinates.southwest[0],
      zoom: this.zoom
    };
    console.log(trash);
    this.authService.getAlltrash(trash).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.commonEntity.transactionStatus === "Y" && response.trashDetailsEntity.length > 0) {
          this.trashCount = response.trashDetailsEntity.length;
          this.allTrash = response.trashDetailsEntity;
          this.myTrash = response.trashDetailsEntity.filter((trash: any) => trash.isMyTrash === true);
          console.log(this.myTrash)
          this.recoveredTrash = response.trashDetailsEntity.filter((trash: any) => trash.isRecovered === true);
        }
      }
    });
   
  }

  onTrashTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.tab.textLabel;
    // this.getTrashDetails(tabType);

  }
  filterNet(){
  this.net = this.myTrash.filter((trash:any)=>trash.categoryId==1);
  console.log(this.net)
    
  }
  filterPlastic(){
    this.plastic = this.myTrash.filter((trash:any)=>trash.categoryId==2);
  console.log(this.plastic)
  }
  filterOil(){
    this.oil = this.myTrash.filter((trash:any)=>trash.categoryId==3);
    console.log(this.oil)
  }
  AddTrackClick() {
    const dialogRef = this.dialog.open(AddtrashComponent, {
      width: '60%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    
  }
  search(){}
}
