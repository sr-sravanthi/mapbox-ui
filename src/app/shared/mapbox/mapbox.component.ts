import { MapboxService } from './../../core/services/mapbox.service';
import { Component, Input, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import * as turf from '@turf/turf';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent {

  map!: mapboxgl.Map;
  style = 'mapbox://styles/msuteu/cllnjn3u5001f01pe07y3e03b';
  lat = -74.5;
  lng = 40;
  zoom = 13;
  popup!: mapboxgl.Popup;

  @Input() trashFiltersTemplate!: TemplateRef<any>;
  @Input("locateUser") locateUserInput: boolean = false;
  @Input("geoCoder") geoCoderInput: boolean = false;
  @Input("container") container!: string;
  @Input("mapData") trashData!: any[];

  locateUser!: mapboxgl.GeolocateControl;
  constructor(private mapboxService: MapboxService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.trashData.length > 0) {
      this.convertToGeoJsonData(this.trashData);
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
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
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
        this.mapboxService.setMapBounds(this.map.getBounds());

        if (this.container === "dashboard") {
          this.initGeoJsonSource();
        }
      }
    });
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

}
