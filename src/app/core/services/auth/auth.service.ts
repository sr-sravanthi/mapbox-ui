
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, forkJoin } from 'rxjs';
import { UserRequest } from 'src/app/core/interfaces/user';
import { TrashRequest } from '../../interfaces/trash';
import { environment } from 'src/environments/environment.development';
import { httpUrls } from '../httpUrl';
import { MasterData } from '../../interfaces/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.BASE_API;
  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // private masterDat$: Subject<boolean> = new Subject<MasterData>();


  public masterData: MasterData = {
    trashCategories: [],
    companyData: [],
    vesselData: [],
    userTypes: []
  };;

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



  getMasterData() {

    let getUserTypes$ = this.getUserTypes();
    let getCompnayNames$ = this.getCompnayNames();
    let getVesselNames$ = this.getVesselNames();


    forkJoin([getUserTypes$, getCompnayNames$, getVesselNames$]).subscribe(
      {
        next: (result) => {
          console.log(result);

          let userTypesResponse = result[0];
          let companyNamesResponse = result[1];
          let vesselNamesResponse = result[2];

          if (userTypesResponse && userTypesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.userTypes = userTypesResponse?.userTypeDetailEntity;
            this.masterData.trashCategories = userTypesResponse?.categoryDetailEntity;

          }
          if (companyNamesResponse && companyNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.companyData = companyNamesResponse?.companyDetails.filter((company: any) => company.name !== "");

          }
          if (vesselNamesResponse && vesselNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.vesselData = vesselNamesResponse?.vesselEntity;
          }
        },
        error: () => {
        }
      }
    );



  }
}
