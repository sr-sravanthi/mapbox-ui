
import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, delay, forkJoin, map, of, startWith } from 'rxjs';
import { UserDetails, UserRequest, UserType } from 'src/app/core/interfaces/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DataPolicyComponent } from '../data-policy/data-policy.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  registrationForm!: FormGroup;
  userTypes!: UserType[];
  companyDetails: any[] = [];
  vesselDetails: any[] = [];
  filteredCompanyOptions: any;
  filteredVesselOptions: any;
  companySuggestions: any;
  companySearchControl = new FormControl();
  vesselSearchControl = new FormControl();
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService ,public dialog: MatDialog) { }
  ngOnInit(): void {
    this.getInitialData()
    this.registrationForm = this.fb.group({
      userName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)]],
      companyId: [""],
      userNumber: [""],
      userId: [""],
      imoNumber: [""],
      VesselID: [""],
      //email: ['', [Validators.required, Validators.email]],
      userTypeID: ["", [Validators.required]],
      profileURL: [""],
      // password: ['', [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]],
      agreeChkbox: [false, [Validators.requiredTrue]],
      // confirmPassword: [''],

    }, {
      // validators: [this.passwordMatchValidator]
    }

    );




    let userDetails: UserDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
    let authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");

    console.log(authUserDetails);
    if (authUserDetails) {
      this.registrationForm.patchValue({ userId: authUserDetails.uid, profileURL: authUserDetails.photoURL, userName: authUserDetails.displayName });
      console.log(this.registrationForm.value)
    }
    if (userDetails) {
      this.registrationForm.patchValue({ userNumber: userDetails.userNumber });
    }

  }

  setupAutocomplete() {
    this.filteredCompanyOptions = this.companySearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.filteredVesselOptions = this.vesselSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._vesselfilter(value || '')),

    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.companyDetails.length > 0 && value != "") {
      return this.companyDetails.filter((option: any) => option.toLowerCase().includes(filterValue));
    }
    else {
      return this.companyDetails;
    }

  }
  private _vesselfilter(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.vesselDetails.length > 0 && value != "") {
      return this.vesselDetails.filter((option: any) => option.toLowerCase().includes(filterValue));
    }
    else {
      return this.companyDetails;
    }

  }


  displayFn(value: any): string {
    return value && typeof value === 'object' ? value.place_name : value;
  }

  searchCompanyFn(searchValue: string) {
    return of(this.companyDetails.filter(company => company.toLowerCase().includes(searchValue.toLowerCase()))).pipe(delay(500));
  }

  displayCompanyFn(value: any) {
    return value && typeof value === 'object' ? value.name : value;
  }

  onItemSelected(item: any) {
    //this.myForm.get('autocompleteControl').setValue(item);
  }

  getInitialData() {

    let getUserTypes$ = this.authService.getUserTypes();
    let getCompanyNames$ = this.authService.getCompnayNames();
    let getVesselNames$ = this.authService.getVesselNames();


    forkJoin([getUserTypes$, getCompanyNames$, getVesselNames$]).subscribe(
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
          this.setupAutocomplete();
        },
        error: () => {
        }
      }
    );



  }

  onRegisterClick() {
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
        if (response.commonEntity?.transactionStatus === "Y" && response.commonEntity?.message === "Success") {
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

  dataPolocyPopup(){
    let dialogRef = this.dialog.open(DataPolicyComponent, {
     
      width: '40%',
    });



  }





}


