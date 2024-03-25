import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddTrashRequest, TrashRequest } from '../../interfaces/trash';
import { Observable, Subject } from 'rxjs';
import { httpUrls } from '../auth/httpUrl';

@Injectable({
  providedIn: 'root'
})

export class TrashService {
  private apiUrl = environment.BASE_API;
  api_key = `0f9f9c48a35882d0adcd096e7e06e450`;

  constructor(private http: HttpClient) { }

  private reloadTrashData = new Subject<void>();
  refreshTrashData$ = this.reloadTrashData.asObservable();

  allTrashAttachmentData: any[] = [];


  refreshTrashData() {
    this.reloadTrashData.next();
  }


  getAlltrash(trash: TrashRequest): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.TRASHDETAILS}`, trash)
  }

  setRecoveredTrash(trashItems: any) {

    return this.http.post(`${this.apiUrl}${httpUrls.RECOVEREDTRASH}`, trashItems)

  }
  addTrash(addTrashReq: AddTrashRequest) {

    return this.http.post(`${this.apiUrl}${httpUrls.ADDTRASH}`, addTrashReq)

  }

  saveAttachment(formdata: FormData): Promise<any> {

    return this.http.post<any>(`${this.apiUrl}${httpUrls.POSTIMAGE}`, formdata).toPromise();

  }

  getAttachmentUrl(fileName: string) {

    return `${this.apiUrl}${httpUrls.GETIMAGE}?fileName=${fileName}`;

  }
  getAttachment(fileName: string) {

    return this.http.get(`${this.apiUrl}${httpUrls.GETIMAGE}?fileName=${fileName}`);

  }

  getWeather(currentLat: any, currentLng: any) {
   


    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?lat=${currentLat}&lon=${currentLng}&appid=${this.api_key}&units=metric`);
  }


}