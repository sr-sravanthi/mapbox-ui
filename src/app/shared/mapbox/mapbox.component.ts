import { MapboxService } from './../../core/services/mapbox.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { MAPBOX_STYLE, MAPBOX_ZOOM } from 'src/app/core/utilities/constants';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent {


  map!: mapboxgl.Map;
  popup!: mapboxgl.Popup;

  @Input() trashFiltersTemplate!: TemplateRef<any>;
  @Input("locateUser") locateUserInput: boolean = false;
  @Input("geoCoder") geoCoderInput: boolean = false;
  @Input("container") container!: string;
  @Input("mapData") trashData!: any[];
  @Input("flyToCords") flyToCords!: any;


  locateUser!: mapboxgl.GeolocateControl;
  constructor(private mapboxService: MapboxService) {
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

  ngAfterViewInit() {
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
  }

  addGeoCoder() {
    const geoCoder = new MapboxGeocoder({
      accessToken: environment.MAPBOX_APIKEY,
      mapboxgl: mapboxgl,
      marker: false,
      reverseGeocode: true,
    });
    this.map.addControl(geoCoder, 'top-left');
  }

  initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.MAPBOX_APIKEY,
      container: this.container,
      style: MAPBOX_STYLE,
      zoom: MAPBOX_ZOOM,
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    if (this.locateUserInput) {
      this.addLocateUser();

    }
    if (this.geoCoderInput) {
      this.addGeoCoder();
    }

    this.map.on('load', () => {
      if (this.locateUserInput) {
        this.locateUser.trigger();
        if (this.container === "dashboard") {
          this.mapboxService.setMapBounds(this.map.getBounds());
          console.log(this.map.getBounds());
          this.initGeoJsonSource();
        }

      }
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
      type: "circle",

    });
  }

  convertToGeoJsonData(trashData: any) {
    const features: turf.Feature<turf.Point, any>[] = [];

    trashData.forEach((item: any) => {
      const lng = item.longitude;
      const lat = item.latitude;
      const feature = turf.point([lng, lat], {
      });
      features.push(feature);
    });

    let trashFeatures = turf.featureCollection(features);
    (this.map.getSource('trash-source') as mapboxgl.GeoJSONSource).setData(
      trashFeatures);
  }


  flyToCoOrdsOnMap(center: any) {
    this.map.flyTo({ center: center, zoom: MAPBOX_ZOOM });
  }


  searchTrashOnMap() {
    this.mapboxService.searchTimestamp = new Date();
    this.mapboxService.setMapBounds(this.map.getBounds());
  }
}
