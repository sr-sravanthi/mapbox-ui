import { GuestUserRequest, UserRequest } from './../../interfaces/user';
import { httpUrls } from './httpUrl';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { MasterData } from '../../interfaces/common';
import * as uuid from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.BASE_API;
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private getuserprofiledetails$: BehaviorSubject<any> = new BehaviorSubject({});

  public masterData: MasterData = {
    trashCategories: [],
    companyData: [],
    vesselData: [],
    userTypes: []
  };

  private masterData$: BehaviorSubject<MasterData> = new BehaviorSubject<MasterData>(this.masterData);



  getIsLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$.asObservable();
  }

  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn$.next(isLoggedIn);
  }

  getMasterData(): Observable<MasterData> {
    return this.masterData$.asObservable();
  }

  getProfileDetails(): Observable<any> {
    return this.getuserprofiledetails$.asObservable();
  }

  setProfileDetails(updateUserDetails: any) {
    return this.getuserprofiledetails$.next(updateUserDetails);
  }

  getUserId() {
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
    return userDetails;
  }
  generateUUIDForGuestUser() {
    const uuidGuestUser = uuid.v1();
    return uuidGuestUser;
  }

  constructor(private http: HttpClient) {

  }

  getUserDetails(user: UserRequest): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.LOGIN}`, user);
  }
  updateUserdetails(user: any): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.SAVEUSER}`, user);
  }

  getUserTypes(): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.MASTERDETAILS}`, { searchKey: "" });
  }

  getTrashTypes(): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.MASTERDETAILS}`, { searchKey: "" });
  }

  getCompnayNames(): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.COMAPANYDETAILS}`, { searchKey: "" });
  }

  getVesselNames(): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.VESSELDETAILS}`, { searchKey: "" });
  }

  linkUserDetails(user: GuestUserRequest): Observable<any> {

    return this.http.post(`${this.apiUrl}${httpUrls.LINKUSER}`, user);

  }




  initMasterData() {

    let getUserTypes$ = this.getUserTypes();
    let getCompnayNames$ = this.getCompnayNames();
    let getVesselNames$ = this.getVesselNames();


    forkJoin([getUserTypes$, getCompnayNames$, getVesselNames$]).subscribe(
      {
        next: (result) => {
          let userTypesResponse = result[0];
          let companyNamesResponse = result[1];
          let vesselNamesResponse = result[2];

          if (userTypesResponse && userTypesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.userTypes = [...userTypesResponse?.userTypeDetailEntity];
            // this.userTypeControl.setValue((this.userTypes.find((option: any) => option.id == this.userDetails.userTypeId))?.name);
            this.masterData.trashCategories = [...userTypesResponse?.categoryDetailEntity];


          }
          if (companyNamesResponse && companyNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.companyData = [...companyNamesResponse?.companyDetails.filter((company: any) => company.name !== "")];

          }
          if (vesselNamesResponse && vesselNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.masterData.vesselData = [...vesselNamesResponse?.vesselEntity];

          }
          this.masterData$.next(this.masterData);

        },
        error: () => {
        }
      }
    );
  }





}
