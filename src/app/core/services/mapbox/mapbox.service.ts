import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  currentmapBounds = new BehaviorSubject<any>(null);
  currentmapBounds$ = this.currentmapBounds.asObservable();
  searchTimestamp: Date | null = null;

  constructor(private http: HttpClient) { }

  setMapbounds(bounds: any): void {
    this.currentmapBounds.next(bounds);
  }
  getCornerCordinates(bounds: mapboxgl.LngLatBounds) {
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
    }
  }
  searchGeoCoder(query: string): Observable<any> {
    const url = `${environment.MAPBOX_API}${encodeURIComponent(query)}.json?access_token=${environment.MAPBOX_APIKEY}`;
    return this.http.get(url);
  }
}
