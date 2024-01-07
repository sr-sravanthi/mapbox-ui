import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import * as mapboxgl from 'mapbox-gl';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dateFormat';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-addtrash',
  templateUrl: './addtrash.component.html',
  styleUrls: ['./addtrash.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter},
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})

export class AddtrashComponent  implements OnInit {
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v8';
  lat = 45.899977;
  lng = 6.172652;
  zoom = 2;
  allTrash!:any;
  popup!: mapboxgl.Popup;
  marker!: mapboxgl.Marker;
  
  addTrashForm!: FormGroup;
  selectedCategory!: string;
  selectedDate!:Date;
  constructor(private fb: FormBuilder) {
 
  }
  ngOnInit(): void {
    this.addTrashForm = this.fb.group({
      image:['null',Validators.required],
      trashName:['',Validators.required],
      date:['null',Validators.required],
      location:['',Validators.required],
      category:['',Validators.required]
    });
   this.addMap();
  }
  addMap(){
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
  });
  }
 
  onSave(){}
}

