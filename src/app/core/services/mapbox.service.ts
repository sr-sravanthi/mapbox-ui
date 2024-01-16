
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  searchGeoCoder(query: string): Observable<any> {
    const url = `${environment.MAPBOX_API}${encodeURIComponent(query)}.json?access_token=${environment.MAPBOX_APIKEY}`;
    return this.http.get(url);
  }

  getChicago() {
    return this.http.get('../../../assets/chicago.geojson');
  }
}
