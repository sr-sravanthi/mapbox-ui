import { MapboxService } from './../../../core/services/mapbox.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _MatAutocompleteBase } from '@angular/material/autocomplete';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import * as mapboxgl from 'mapbox-gl';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { MAPBOX_STYLE, MAPBOX_ZOOM } from 'src/app/core/utilities/constants';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dateFormat';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-addtrash',
  templateUrl: './addtrash.component.html',
  styleUrls: ['./addtrash.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})

export class AddtrashComponent implements OnInit {

  map!: mapboxgl.Map;
  allTrash!: any;
  popup!: mapboxgl.Popup;
  marker!: mapboxgl.Marker;

  addTrashForm!: FormGroup;
  selectedCategory!: string;
  selectedDate!: Date;

  geoCoder!: MapboxGeocoder;

  searchControl = new FormControl();
  geoCoderSuggestions: any[] = [];


  @ViewChild('geocoderInput', { static: true }) geocoderInput!: ElementRef;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  auto!: _MatAutocompleteBase;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<AddtrashComponent>, private mapboxService: MapboxService) {

  }
  ngOnInit(): void {
    this.addTrashForm = this.fb.group({
      image: ['null', Validators.required],
      trashName: ['', Validators.required],
      date: ['null', Validators.required],
      location: ['', Validators.required],
      category: ['', Validators.required]
    });
    this.addMap();
    this.setupAutocomplete();
  }
  addMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.MAPBOX_APIKEY,
      container: 'addtrash',
      style: MAPBOX_STYLE,
      zoom: MAPBOX_ZOOM
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

    this.geoCoder = new MapboxGeocoder({
      accessToken: environment.MAPBOX_APIKEY,
      mapboxgl: mapboxgl,
      marker: false,
      reverseGeocode: true,
    });
    this.map.addControl(this.geoCoder, 'top-left');

    this.map.on('load', () => {
      locateUser.trigger();
    });
  }

  onGeoCoderSelection(event: any) {
    console.log(event.option.value);
    const data = event.option.value;
    const coordinates = data?.geometry?.coordinates;
    this.map.flyTo({ center: coordinates, zoom: 13 });

  }

  setupAutocomplete() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query) => (query ? this.mapboxService.searchGeoCoder(query) : of([]))),
        catchError(() => of([]))
      )
      .subscribe((data: any) => {
        this.geoCoderSuggestions = data.features;
        console.log(this.geoCoderSuggestions);
      });
  }

  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.place_name : value;
  }

  onSave() { }


  closePopup() {
    this.dialogRef.close();
  }
}

