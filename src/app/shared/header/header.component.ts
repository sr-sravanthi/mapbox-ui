import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { UserDetails } from 'src/app/core/interfaces/user';

const PROFILEMENUITEMS: any = [
  { key: "Eyesea", label: 'Eyesea Website', icon: 'custom-sprite website-icon', url: 'https://eyesea.org/', isHidden: false },
  { key: "datapolicy", label: 'Data Policy', icon: 'custom-sprite policy-icon', url: 'https://eyesea.org/privacy-policy/', isHidden: false },
  { key: "contact", label: 'Contact Us', icon: 'custom-sprite help-icon', url: 'https://eyesea.org/contact/', isHidden: false },
  { key: "editprofile", label: 'Edit Profile', icon: 'custom-sprite edit-profile-icon', url: '', isHidden: false },
  { key: "logout", label: 'Logout', icon: 'custom-sprite logout-icon', url: '', isHidden: false }
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  authUserDetails: any;
  userDetails!: UserDetails;
  imageUrl: string = '';
  profileMenuItems = PROFILEMENUITEMS;
  updatedUserDetails: any;
  awardsList: any;
  personalAwardDetails: any;
  vesselAwardDetails: any;
  organizationAwardDetails: any;
  constructor(public dialog: MatDialog, public authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    initializeApp(environment.firebaseConfig)
    this.getuserdetails();

  }


  getuserdetails() {
   
    this.authService.getProfileDetails().subscribe((userData: any) => {

      if (sessionStorage.getItem("authProviderUserData")) {
        this.authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");
      }
      if (this.authUserDetails) {
        this.imageUrl = this.authUserDetails?.photoURL + "?nocache=" + new Date().getTime();
      }
    
      this.userDetails = userData;
      if (this.userDetails.isGuestUser === "Y") {
        this.imageUrl = "../../../assets/style/images/guest_profile.png";
      }
      this.profileMenuItems = this.profileMenuItems.map((item: any) => {
        item.isHidden = (item.key === 'editprofile' && this.userDetails.isGuestUser === "Y") ? true : false
        return item;
      });
    });
  }

  signoutAuth() {
    const auth = getAuth();
    console.log(auth);
    auth.signOut().then((res) => {
      sessionStorage.clear();
      this.router.navigateByUrl("profile/login");
      this.authService.setIsLoggedIn(false);

    }).catch((error) => {
    });
  }

  signout() {
    if (this.userDetails.isRegistered) {
      this.signoutAuth();
    }
    else {
      sessionStorage.clear();
      this.router.navigateByUrl("profile/login");
      this.authService.setIsLoggedIn(false);
    }

  }

  navigate(ind: number) {
    if (this.profileMenuItems[ind].label === 'Edit Profile') {
      this.router.navigateByUrl("profile/editprofile")
    }
    else if (this.profileMenuItems[ind].label === 'Logout') {
      this.signout();
    }
    else {
      window.open(this.profileMenuItems[ind].url, '_blank');
    }

  }

  onGuestRegister() {
    this.authService.setIsLoggedIn(false);
    this.router.navigateByUrl("profile/login?linkuser=true")
  }
}
