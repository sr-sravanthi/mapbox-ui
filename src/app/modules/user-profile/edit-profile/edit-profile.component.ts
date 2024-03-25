import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserType, Company, Vessel, MasterData } from 'src/app/core/interfaces/common';
import { UserRequest } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  registrationForm!: FormGroup;
  userTypes: UserType[] = [];
  companyDetails: Company[] = [];
  vesselDetails: Vessel[] = [];
  imageUrl: any;
  authUserDetails: any;
  userDetails: any;
  filteredOptionsVessels: Observable<any[]> | undefined;
  filteredOptionsOrgs: Observable<any[]> | undefined;
  filteredOptionsUsers: Observable<any[]> | undefined;
  imoNumber: string = '';
  userTypeControl = new FormControl();

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getMasterData().subscribe((data: MasterData) => {
      this.userTypes = data.userTypes;
      this.companyDetails = data.companyData;
      this.vesselDetails = data.vesselData;
    })

    this.registrationForm = this.fb.group({
      userName: ["", [Validators.required]],
      companyId: [""],
      userNumber: [{ value: '', disabled: true }],
      userId: [""],
      imoNumber: [""],
      VesselID: [""],
      userTypeID: ["", [Validators.required]],
      profileURL: [""],
    });

    if (sessionStorage.getItem("authProviderUserData") !== null) {
      this.authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");
      this.imageUrl = this.authUserDetails?.photoURL + "?nocache=" + new Date().getTime();
      this.registrationForm.patchValue({ profileURL: this.authUserDetails?.photoURL });

    }

    if (sessionStorage.getItem("userDetails") !== null) {
      this.userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
      this.imoNumber = this.userDetails.imoNumber;
      this.registrationForm.patchValue({
        userId: this.userDetails.userID, userNumber: this.userDetails.userNumber, userName: this.userDetails.name, companyId: this.userDetails.companyId,
        VesselID: this.userDetails.vesselId, userTypeID: Number(this.userDetails.userTypeId)
      });
    }

  }

  onOptionSelected(option: any, controlName: string) {
    this.registrationForm.get(controlName)?.setValue(option);
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

  oneditRegisterClick() {

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
          this.authService.setProfileDetails(response.userDetailEntity[0]);
          this.router.navigateByUrl('/user/dashboard');
        }
        else {
        }
      },
      error: (err) => {
      },
    });

  }

}
