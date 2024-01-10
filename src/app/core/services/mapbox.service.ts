import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  currentMapBounds = new BehaviorSubject<any>(null);
  currentMapBounds$ = this.currentMapBounds.asObservable();

  constructor(private http: HttpClient) { }

  setMapBounds(bounds: any): void {
    this.currentMapBounds.next(bounds);
  }

  getCornerCoordinates(bounds: mapboxgl.LngLatBounds) {
    const southwest = bounds.getSouthWest();
    const southeast = bounds.getSouthEast();
    const northeast = bounds.getNorthEast();
    const northwest = bounds.getNorthWest();

    return {
      nELatitude: northeast.lat,
      nELongitude: northwest.lng,
      nWLatitude: northwest.lat,
      nWLongitude: northwest.lng,
      sELatitude: southeast.lat,
      sELongitude: southeast.lng,
      sWLatitude: southwest.lat,
      sWLongitude: southwest.lng,
    };

  }

  getChicago() {
    return this.http.get('../../../assets/chicago.geojson');
  }
}
