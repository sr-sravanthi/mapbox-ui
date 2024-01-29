import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserDetails, UserRequest, UserType } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  registrationForm!: FormGroup;
  userTypes!: UserType[];
  companyDetails: any;
  vesselDetails: any;
  imageUrl: any;
  authUserDetails: any;
  userDetails: any;
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }
  ngOnInit(): void {
    this.getInitialData()
    this.registrationForm = this.fb.group({
      userName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
      companyId: [""],
      userNumber: [""],
      userId: [""],
      imoNumber: [""],
      VesselID: [""],
      userTypeID: ["", [Validators.required]],
      profileURL: [""],


    });

    if (sessionStorage.getItem("authProviderUserData") !== null) {
      this.authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");
      this.imageUrl = this.authUserDetails?.photoURL + "?nocache=" + new Date().getTime();
      this.registrationForm.patchValue({ profileURL: this.authUserDetails?.photoUR });

    }

    if (sessionStorage.getItem("userDetails") !== null) {
      this.userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

      this.registrationForm.patchValue({
        userId: this.userDetails.userID, userNumber: this.userDetails.userNumber, userName: this.userDetails.name, companyId: this.userDetails.companyId,
        VesselID: this.userDetails.vesselId, imoNumber: this.userDetails.imoNumber, userTypeID: Number(this.userDetails.userTypeId)
      });
    }
    console.log(this.registrationForm.value)
  }


  getInitialData() {

    let getUserTypes$ = this.authService.getUserTypes();
    let getCompnayNames$ = this.authService.getCompnayNames();
    let getVesselNames$ = this.authService.getVesselNames();


    forkJoin([getUserTypes$, getCompnayNames$, getVesselNames$]).subscribe(
      {
        next: (result) => {
          console.log(result);
          let userTypesResponse = result[0];
          let companyNamesResponse = result[1];
          let vesselNamesResponse = result[2];

          if (userTypesResponse && userTypesResponse?.commonEntity.transactionStatus === "Y") {
            this.userTypes = userTypesResponse?.userTypeDetailEntity;
            console.log(this.userTypes)
          }
          if (companyNamesResponse && companyNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.companyDetails = companyNamesResponse?.companyDetails.filter((company: any) => company.name !== "");
            console.log(this.companyDetails)
          }
          if (vesselNamesResponse && vesselNamesResponse?.commonEntity.transactionStatus === "Y") {
            this.vesselDetails = vesselNamesResponse?.vesselEntity;
            console.log(this.vesselDetails)
          }
        },
        error: () => {
        }
      }
    );



  }

  oneditRegisterClick() {
    console.log(this.registrationForm.value);
    if (this.registrationForm.valid) {
      delete this.registrationForm.value.agreeChkbox;
      this.registrationForm.value.VesselID = this.registrationForm.value.VesselID.toString();
      this.registrationForm.value.userTypeID = this.registrationForm.value.userTypeID.toString();

      let requestData = { UserDetailEntity: [this.registrationForm.value] }
      this.authService.updateUserdetails(requestData).subscribe((res: any) => {
        if (res && res.transactionStatus === "Y") {
          this.getUserData();
        }
      });

    }

  }

  getUserData() {
    const user: UserRequest = {
      userid: this.registrationForm.value.userId
    };

    this.authService.getUserDetails(user).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.commonEntity?.transactionStatus === "Y") {
          console.log(response.userDetailEntity);
          sessionStorage.setItem('userDetails', JSON.stringify(response.userDetailEntity[0]));
          if (response.userDetailEntity[0]?.isRegistered) {
            this.authService.setIsLoggedIn(true);
            this.router.navigateByUrl('/user/dashboard');
          }
        }
        else {
        }
      },
      error: (err) => {
        console.error(err);
      },
    });

  }

}
