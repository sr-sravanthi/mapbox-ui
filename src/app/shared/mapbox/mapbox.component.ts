import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef } from '@angular/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment.development';
import * as turf from '@turf/turf';
import { MapboxService } from 'src/app/core/services/mapbox/mapbox.service';
import { MAP_STYLE, MAP_ZOOM } from 'src/app/core/utilities/constants';

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent {
  map!: mapboxgl.Map;
  locateUser!: mapboxgl.GeolocateControl;
  @Input() trashFiltersTemplate!: TemplateRef<any>
  @Input("locateUser") locateUserInput: boolean = false;
  @Input("container") container!: string;
  @Input("geoCoder") geoCoderInput: boolean = false;
  @Input("mapData") trashData!: any[];
  @Input("flyToCords") flyToCords!: any
  constructor(private mapboxService: MapboxService) { }

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
    this.map.addControl(this.locateUser, 'bottom-right')
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
      style: MAP_STYLE,
      zoom: MAP_ZOOM
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    if (this.locateUserInput) {
      this.addLocateUser();
    }
    if (this.geoCoderInput) {
      this.addGeoCoder()
    }
    this.map.on('load', () => {
      if (this.locateUserInput) {
        this.locateUser.trigger();
        this.loadImagesForMap();
        this.mapboxService.setMapbounds(this.map.getBounds());
        if (this.container === "dashboard") {
          this.initGeoJsonSource();
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
      // layout: {
      //   'icon-image': 'red-marker',
      //   'icon-size': 1,
      // },
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

    console.log(features);
    let trashFeatures = turf.featureCollection(features);
    (this.map.getSource('trash-source') as mapboxgl.GeoJSONSource).setData(trashFeatures)
  }
  flyToCoOrdsOnMap(center: any) {
    this.map.flyTo({ center: center, zoom: MAP_ZOOM });
  }

  searchTrashOnMap() {
    this.mapboxService.searchTimestamp = new Date();
    this.mapboxService.setMapbounds(this.map.getBounds());
  }

}