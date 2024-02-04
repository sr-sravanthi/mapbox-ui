import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddTrashRequest, TrashRequest } from '../../interfaces/trash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { httpUrls } from '../httpUrl';

@Injectable({
  providedIn: 'root'
})
export class TrashService {
  private apiUrl = environment.BASE_API;



  constructor(private http: HttpClient) { }

  private reloadTrashData = new Subject<void>();
  refreshTrashData$ = this.reloadTrashData.asObservable();

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

  saveAttachment(formdata: any) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        reportProgress: "true",
      }),
    };
    return this.http.post(`${this.apiUrl}${httpUrls.POSTIMAGE}`, formdata, options)
  }
}
