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
import * as turf from '@turf/turf';


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
  userCoordinates: any[] = [];
  trashDataForMap: any;
  net: any[] = [];
  plastic: any[] = [];
  oil: any[] = [];
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
      this.map.loadImage(
        '../../../../assets/style/images/new-trash-marker.jpg', (
        (error, image: any) => {
          if (error) throw (error);
          this.map.addImage('new-trash-marker', image);
          locateUser.trigger();
          this.getCornerCoordinates();


        }
      )
      )


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
          this.getTrashDataForMap(this.allTrash);
        }
      }
    });

  }

  getTrashDataForMap(trashData: any) {
    const features: turf.Feature<turf.Point, any>[] = [];

    trashData.forEach((item: any) => {
      const lng = item.longitude;
      const lat = item.latitude;
      const feature = turf.point([lng, lat], {
      });
      features.push(feature);
    });

    this.trashDataForMap = turf.featureCollection(features);

    this.map.addSource('trash-source', {
      type: 'geojson',
      data: {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "properties": {
              "title": "Lincoln Park",
              "description": "A northside park that is home to the Lincoln Park Zoo"
            },
            "geometry": {
              "coordinates": [
                -87.637596,
                41.940403
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Burnham Park",
              "description": "A lakefront park on Chicago's south side"
            },
            "geometry": {
              "coordinates": [
                -87.603735,
                41.829985
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Millennium Park",
              "description": "A downtown park known for its art installations and unique architecture"
            },
            "geometry": {
              "coordinates": [
                -87.622554,
                41.882534
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Grant Park",
              "description": "A downtown park that is the site of many of Chicago's favorite festivals and events"
            },
            "geometry": {
              "coordinates": [
                -87.619185,
                41.876367
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Humboldt Park",
              "description": "A large park on Chicago's northwest side"
            },
            "geometry": {
              "coordinates": [
                -87.70199,
                41.905423
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Douglas Park",
              "description": "A large park near in Chicago's North Lawndale neighborhood"
            },
            "geometry": {
              "coordinates": [
                -87.699329,
                41.860092
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Calumet Park",
              "description": "A park on the Illinois-Indiana border featuring a historic fieldhouse"
            },
            "geometry": {
              "coordinates": [
                -87.530221,
                41.715515
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Jackson Park",
              "description": "A lakeside park that was the site of the 1893 World's Fair"
            },
            "geometry": {
              "coordinates": [
                -87.580389,
                41.783185
              ],
              "type": "Point"
            }
          },
          {
            "type": "Feature",
            "properties": {
              "title": "Columbus Park",
              "description": "A large park in Chicago's Austin neighborhood"
            },
            "geometry": {
              "coordinates": [
                -87.769775,
                41.873683
              ],
              "type": "Point"
            }
          }
        ]
      },
    });
    this.map.addLayer({
      id: 'trash-layer',
      source: 'trash-source',
      type: 'symbol',
      layout: {
        'icon-image': 'new-trash-marker',
        'icon-size': 1.5,
      },
    });

  }

  onTrashTabChange(event: MatTabChangeEvent) {
    this.selectedTab = event.tab.textLabel;
    // this.getTrashDetails(tabType);

  }
  filterNet() {
    this.net = this.myTrash.filter((trash: any) => trash.categoryId == 1);
    console.log(this.net)

  }
  filterPlastic() {
    this.plastic = this.myTrash.filter((trash: any) => trash.categoryId == 2);
    console.log(this.plastic)
  }
  filterOil() {
    this.oil = this.myTrash.filter((trash: any) => trash.categoryId == 3);
    console.log(this.oil)
  }
  AddTrackClick() {
    const dialogRef = this.dialog.open(AddtrashComponent, {
      width: '60%',
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }
  search() { }
}
