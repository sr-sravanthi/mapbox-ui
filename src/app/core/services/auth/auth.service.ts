import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails, UserRequest } from 'src/app/core/interfaces/user';
import { TrashRequest } from '../../interfaces/trash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl = 'https://mapps-pal-ci.mariapps.com/ESMobileService/';
 private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn$.next(isLoggedIn);
  }
  constructor(private http: HttpClient) { }
  getUserDetails(user: UserRequest): Observable<any> {
    const url = `${this.apiUrl}login/LoginV2`;
    return this.http.post(url, user);
  }
  updateUserdetails(user: any): Observable<any> {
    const url = `${this.apiUrl}user/SaveUserDetails`;
    return this.http.post(url, user);
  }

  getUserTypes(): Observable<any> {
    const url = `${this.apiUrl}home/FetchMasterDetails`;
    return this.http.post(url, { searchKey: "" });
  }

  getCompnayNames(): Observable<any> {
    const url = `${this.apiUrl}company/FetchCompanyDetails`;
    return this.http.post(url, { searchKey: "" });
  }

  getVesselNames(): Observable<any> {
    const url = `${this.apiUrl}Vessel/FetchVesselDetails`;
    return this.http.post(url, { searchKey: "" });
  }
  getAlltrash(trash:TrashRequest): Observable<any> {
    const url = `${this.apiUrl}Trash/FetchTrashDetailsV2`;
    return this.http.post(url,trash)
  
}
}
