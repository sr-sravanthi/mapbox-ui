import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRequest } from 'src/app/core/interfaces/user';
import { TrashRequest } from '../../interfaces/trash';
import { environment } from 'src/environments/environment.development';
import { httpUrls as urls } from '../httpUrl';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.BASE_API;
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn$.next(isLoggedIn);
  }

  constructor(private http: HttpClient) {}

  getUserDetails(user: UserRequest): Observable<any> {
    return this.http.get(`${this.apiUrl}${urls.LOGIN}`);
  }
  updateUserdetails(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${urls.SAVEUSER}`, user);
  }

  getUserTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}${urls.MASTERDATA}`);
  }

  getCompnayNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}${urls.COMPANYDATA}`);
  }

  getVesselNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}${urls.VESSELDATA}`);
  }
  getAlltrash(trash: TrashRequest): Observable<any> {
    return this.http.get(`${this.apiUrl}${urls.TRASHDETAILS}`);
  }
}
