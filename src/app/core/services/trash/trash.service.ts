import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AddTrashRequest, TrashRequest } from '../../interfaces/trash';
import { Observable } from 'rxjs';
import { httpUrls } from '../auth/httpUrl';

@Injectable({
  providedIn: 'root'
})
export class TrashService {
  private apiUrl = environment.BASE_API;

  constructor(private http: HttpClient) { }

  getAlltrash(trash: TrashRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${httpUrls.TRASHDETAILS}`, trash)
  }

  setRecoveredTrash(trashItems: any) {
    return this.http.post(`${this.apiUrl}${httpUrls.RECOVEREDTRASH}`, trashItems)

  }
  addTrash(addTrashReq: AddTrashRequest) {
    return this.http.post(`${this.apiUrl}${httpUrls.ADDTRASH}`, addTrashReq)

  }

  saveAttachment(file: any) {
    let options = {
      headers: new HttpHeaders({
        "Content-Type": "multipart/form-data",
        reportProgress: "true",
        responseType: "json",
        observe: 'events'

      }),
    };
    return this.http.post(`${this.apiUrl}${httpUrls.POSTIMAGE}`, file, options)
  }
}
