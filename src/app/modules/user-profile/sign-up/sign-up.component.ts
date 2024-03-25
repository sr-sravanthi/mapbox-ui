import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRequest } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UserType, Company, Vessel, MasterData } from 'src/app/core/interfaces/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  registrationForm!: FormGroup;
  userTypes: UserType[] = [];
  companyDetails: Company[] = [];
  vesselDetails: Vessel[] = [];
  filteredCompanyOptions: any;
  filteredVesselOptions: any;
  companySuggestions: any;
  companySearchControl = new FormControl();
  vesselSearchControl = new FormControl();
  authUserDetails: any;
  imageUrl: string = '';
  userDetails: any;
  imoNumber: string = '';
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, public dialog: MatDialog) { }
  ngOnInit(): void {

    this.authService.getMasterData().subscribe((data: MasterData) => {
      this.userTypes = data.userTypes;
      this.companyDetails = data.companyData;
      this.vesselDetails = data.vesselData
    });
    ;

    this.registrationForm = this.fb.group({
      userName: [""],
      companyId: [""],
      userNumber: [{ value: '', disabled: true }],
      userId: [""],
      imoNumber: [""],
      VesselID: [""],
      userTypeID: ["", [Validators.required]],
      profileURL: [""],
      agreeChkbox: [false, [Validators.requiredTrue]]
    });


    if (sessionStorage.getItem("authProviderUserData") !== null) {
      this.authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");
      this.imageUrl = this.authUserDetails?.photoURL + "?nocache=" + new Date().getTime();
      this.registrationForm.patchValue({ profileURL: this.authUserDetails?.photoURL, userName: this.authUserDetails.displayName });

    }
    this.userDetails = this.authService.getUserId();
    this.registrationForm.patchValue({
      userId: this.userDetails.userID, userNumber: this.userDetails.userNumber
    });

  }

  onVesselSelected(event: any) {
    this.registrationForm.get("VesselID")?.setValue(event["id"]);
    this.imoNumber = event["imoNumber"];
  }

  onCompanySelected(event: any) {
    this.registrationForm.get("companyId")?.setValue(event["id"]);
  }

  onUserTypeSelected(event: any) {
    this.registrationForm.get("userTypeID")?.setValue(event["id"]);
  }

  onVesselChange(event: any) {
    let vesselDetails = this.registrationForm.get('VesselID')?.value;;
    this.registrationForm.get("imoNumber")?.setValue(vesselDetails.imoNumber);
  }

  onRegisterClick() {

    if (this.registrationForm.valid) {
      delete this.registrationForm.value.agreeChkbox;
      this.registrationForm.value.VesselID = this.registrationForm.value.VesselID.toString();
      this.registrationForm.value.userTypeID = this.registrationForm.value.userTypeID.toString();
      this.registrationForm.value.imoNumber = this.imoNumber;
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
        if (response.commonEntity?.transactionStatus === "Y") {
           sessionStorage.setItem('userDetails', JSON.stringify(response.userDetailEntity[0]));
          if (response.userDetailEntity[0]?.isRegistered) {
            this.authService.setIsLoggedIn(true);
            this.authService.setProfileDetails(response.userDetailEntity[0]);
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



