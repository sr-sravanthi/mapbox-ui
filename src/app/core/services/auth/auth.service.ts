
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRequest } from 'src/app/core/interfaces/user';
import { TrashRequest } from '../../interfaces/trash';
import { environment } from 'src/environments/environment.development';
import { httpUrls } from '../httpUrl';

@Injectable({
  providedIn: 'root'
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
  constructor(private http: HttpClient) { }


  getUserDetails(user: UserRequest): Observable<any> {
    console.log(httpUrls);
    return this.http.get(`${this.apiUrl}${httpUrls.LOGIN}`);
  }
  updateUserdetails(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${httpUrls.SAVEUSER}`, user);
  }

  getUserTypes(): Observable<any> {
    return this.http.get(`${this.apiUrl}${httpUrls.MASTERDETAILS}`);
  }

  getCompnayNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}${httpUrls.COMAPANYDETAILS}`);
  }

  getVesselNames(): Observable<any> {
    return this.http.get(`${this.apiUrl}${httpUrls.VESSELDETAILS}`);
  }
  getAlltrash(trash: TrashRequest): Observable<any> {
    return this.http.get(`${this.apiUrl}${httpUrls.TRASHDETAILS}`);
  }

  // Real API
  // getUserDetails(user: UserRequest): Observable<any> {

  //   return this.http.post(`${this.apiUrl}${httpUrls.LOGIN}`, user);
  // }
  // updateUserdetails(user: any): Observable<any> {

  //   return this.http.post(`${this.apiUrl}${httpUrls.SAVEUSER}`, user);
  // }

  // getUserTypes(): Observable<any> {

  //   return this.http.post(`${this.apiUrl}${httpUrls.MASTERDETAILS}`, { searchKey: "" });
  // }

  // getCompnayNames(): Observable<any> {

  //   return this.http.post(`${this.apiUrl}${httpUrls.COMAPANYDETAILS}`, { searchKey: "" });
  // }

  // getVesselNames(): Observable<any> {

  //   return this.http.post(`${this.apiUrl}${httpUrls.VESSELDETAILS}`, { searchKey: "" });
  // }

}
