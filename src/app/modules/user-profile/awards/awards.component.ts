import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { UserRequest } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { AwardsService } from 'src/app/core/services/awards/awards.service';

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.scss']
})
export class AwardsComponent implements OnInit {

  tabNames = ["Personal", "Vessel", "Organization"];
  personalAwardDetails: any;
  vesselAwardDetails: any;
  organizationAwardDetails: any;
  userDetails: any;

  constructor(private awardsService: AwardsService, public authService: AuthService) {

  }
  ngOnInit(): void {
    this.getAwardDetails();
  }


  getAwardDetails() {
    this.userDetails=this.authService.getUserId();
    const user: UserRequest = {
      userid: this.userDetails.userID
    }
    let fetchPersonalDetails$ = this.awardsService.getAwardsDetails(user);
    let fetchVesselDetails$ = this.awardsService.getVesselPoints(user);
    let FetchOrganizationDetails$ = this.awardsService.getOrganizationPoints(user);


    forkJoin([fetchPersonalDetails$, fetchVesselDetails$, FetchOrganizationDetails$]).subscribe({
      next: (result) => {
        let fetchPersonalResponse = result[0];
        let vesselAwardsResponse = result[1];
        let organizationAwardsResponse = result[2];

        if (fetchPersonalResponse && fetchPersonalResponse?.commonEntity.transactionStatus === "Y" && fetchPersonalResponse.commonEntity?.message === "Success") {
          this.personalAwardDetails = fetchPersonalResponse.personalAwardEntity.sort(((a: { rank: number; }, b: { rank: number; }) => a.rank - b.rank));
          console.log(this.personalAwardDetails);
          
        }
        if (vesselAwardsResponse && vesselAwardsResponse?.commonEntity.transactionStatus === "Y" && vesselAwardsResponse.commonEntity?.message === "Success") {
          this.vesselAwardDetails = vesselAwardsResponse.vesselAwardEntity.sort(((a: { rank: number; }, b: { rank: number; }) => a.rank - b.rank));
          console.log(this.vesselAwardDetails);
        }
        if (organizationAwardsResponse && organizationAwardsResponse?.commonEntity.transactionStatus === "Y" && vesselAwardsResponse.commonEntity?.message === "Success") {
          this.organizationAwardDetails = organizationAwardsResponse.organizationAwardEntity.sort(((a: { rank: number; }, b: { rank: number; }) => a.rank - b.rank));
          console.log(this.organizationAwardDetails);
        }
      },
      error: () => {
      }
    }
    );
  }

}