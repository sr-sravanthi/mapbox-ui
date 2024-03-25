import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { UserRequest } from '../../interfaces/personalpoints';
import { httpUrls } from '../auth/httpUrl';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AwardsService {
  private apiUrl = environment.BASE_API;
  
 constructor(private http: HttpClient) { }

  getAwardsDetails(user: UserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${httpUrls.PERSONALPOINTS}`, user);
  }

  getVesselPoints(user: UserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${httpUrls.VESSELPOINTS}`, user);
  }

  getOrganizationPoints(user: UserRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}${httpUrls.ORGANIZATIONPOINTS}`, user);
  }
  


}
