import { MAP_ZOOM } from 'src/app/core/utilities/constants';
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
  currentMapZoom: number = MAP_ZOOM;

  currentMapCenter: any = null;

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

  getaddressByCoordinates(coords: any) {
    let url = `${environment.MAPBOX_API}${coords[0]},${coords[1]}.json?access_token=${environment.MAPBOX_APIKEY}`;
    return this.http.get(url);
  }

  formatLatitude(lat: number): string {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const latStr = Math.abs(lat).toFixed(3);
    return `${latDirection}${latStr}`;
  }

  formatLongitude(lng: number): string {
    const lngDirection = lng >= 0 ? 'E' : 'W';
    const lngStr = Math.abs(lng).toFixed(3);
    return `${lngDirection}${lngStr}`;
  }
}


