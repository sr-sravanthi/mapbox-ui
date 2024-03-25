import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment.development';
import * as turf from '@turf/turf';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { MAP_MAXZOOM, MAP_MINZOOM, MAP_STYLE, MAP_ZOOM } from 'src/app/core/utilities/constants';
import { MatDialog } from '@angular/material/dialog';
import { TrashitemPopupComponent } from 'src/app/modules/dashboard/trashitem-popup/trashitem-popup.component';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {
  map!: mapboxgl.Map;
  geoCodermarker!: mapboxgl.Marker;
  locateUser!: mapboxgl.GeolocateControl;


  @Input() trashFiltersTemplate!: TemplateRef<any>
  @Input("locateUser") locateUserInput: boolean = false;
  @Input("container") container!: string;
  @Input("geoCoder") geoCoderInput: boolean = false;
  @Input("flyToCords") flyToCords!: any
  @Output("geoCoderDraggedCords") geoCoderDraggedCords = new EventEmitter<any>();
  @Input('tabName') tabName: any;
  @Input('trashData') trashData: any[] = [];

  constructor(private mapboxService: MapboxService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.trashData) {
      if (this.trashData.length > 0) {
        this.convertToGeoJsonData(this.trashData);
      }
      else {
        (this.map.getSource('trash-source') as mapboxgl.GeoJSONSource).setData(
          {
            "type": "FeatureCollection",
            "features": []
          });
      }
    }
    if (this.flyToCords) {
      this.flyToCoOrdsOnMap(this.flyToCords)
    }
  }

  ngAfterViewInit(): void {

    this.initMap();

  }

  addLocateUser() {
    this.locateUser = new mapboxgl.GeolocateControl({
      showAccuracyCircle: false,
      showUserLocation: true,
      positionOptions: {
        enableHighAccuracy: true,
      },

    });
    this.map.addControl(this.locateUser, 'bottom-right');

    this.locateUser.on('geolocate', (e: any) => {
      let userCoordinates = new mapboxgl.LngLat(
        e.coords.longitude,
        e.coords.latitude
      );

      this.mapboxService.currentMapCenter = userCoordinates.toArray();
      if (this.container == "addtrash") {
        this.geoCodermarker = new mapboxgl.Marker({
          color: '#F84C4C',
          draggable: true
        });

        this.geoCodermarker.on('dragend', () => {

          this.geoCoderDraggedCords.emit(this.geoCodermarker.getLngLat().toArray());
        });
        this.geoCodermarker.setLngLat(userCoordinates).
      
        addTo(this.map);
      }
    });



  }

  addGeoCoder() {
    const geoCoder = new MapboxGeocoder({
      accessToken: environment.MAPBOX_APIKEY,
      mapboxgl: mapboxgl,
      marker: true,
      reverseGeocode: false,
    });
    this.map.addControl(geoCoder, 'top-left');

  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.MAPBOX_APIKEY,
      container: this.container,
      style: MAP_STYLE,
      zoom: MAP_ZOOM,
      minZoom: MAP_MINZOOM,
      maxZoom: MAP_MAXZOOM,



    });
    this.map.addControl(new mapboxgl.NavigationControl(),'bottom-right');

    if (this.locateUserInput) {
      this.addLocateUser();

    }
    if (this.geoCoderInput) {
      this.addGeoCoder();

    }
    this.map.on('load', () => {


      if (this.locateUserInput) {

        this.loadImagesForMap();
        if (this.container === "dashboard") {
          if (this.mapboxService.currentMapCenter == null) {
            this.locateUser.trigger();
          }
          else {
            this.map.setCenter(this.mapboxService.currentMapCenter);
          }

          this.mapboxService.setMapbounds(this.map.getBounds());



          this.initGeoJsonSource();
        }
        if (this.container === "addtrash") {
          this.locateUser.trigger();

        }
      }


    })
  }

  loadImagesForMap() {
    this.map.loadImage('../../assets/style/images/marker-red.png', (error, image: any) => {
      if (error) throw (error);
      this.map.addImage('red-marker', image);
    });
    this.map.loadImage('../../assets/style/images/marker-green.png', (error, image: any) => {
      if (error) throw (error);
      this.map.addImage('green-marker', image);
    });
  }

  addDraggableOnMap() {
    this.map.on("dragend", () => {
      console.log("dragend");
      console.log(this.map.getBounds());

    })
  }

  initGeoJsonSource() {
    this.map.addSource('trash-source', {
      type: 'geojson',
      data: {
        "type": "FeatureCollection",
        "features": []
      },
    });
    this.map.addLayer({
      id: 'trash-layer',
      source: 'trash-source',
      type: 'symbol',

      layout: {
        'icon-image': [
          'match',
          ['get', 'isRecoveredStr'],
          'true', 'green-marker',
          'red-marker'
        ],
        'icon-size': 1.5,
      },
    });

    this.map.on('click', 'trash-layer', (e: any) => {
      console.log(e.lngLat);
      console.log(e.features[0].properties);


      let dialogRef = this.dialog.open(TrashitemPopupComponent, {
        data: e.features[0].properties,
        width: '40%',
      });

    });


  }

  convertToGeoJsonData(trashData: any) {
    const features: turf.Feature<turf.Point, any>[] = [];
    trashData.forEach((item: any) => {
      const lng = item.longitude;
      const lat = item.latitude;
      const feature = turf.point([lng, lat], {
        isRecoveredStr: item.isRecovered ? "true" : "false",
        ...item
      });
      features.push(feature);
    });


    let trashFeatures = turf.featureCollection(features);
    (this.map.getSource('trash-source') as mapboxgl.GeoJSONSource).setData(trashFeatures)
  }
  flyToCoOrdsOnMap(center: any) {
    this.map.flyTo({ center: center, zoom: MAP_ZOOM });
    this.geoCodermarker.setLngLat(center).addTo(this.map);

  }

  searchTrashOnMap() {
    this.mapboxService.searchTimestamp = new Date();
    this.mapboxService.setMapbounds(this.map.getBounds());

    this.mapboxService.currentMapZoom = Math.round(this.map.getZoom());
    this.mapboxService.currentMapCenter = this.map.getCenter();

  }

}