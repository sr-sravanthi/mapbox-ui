import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserDetails } from 'src/app/core/interfaces/user';
import firebase from "firebase/compat/app"
import { getAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  authUserDetails: any;
  imageUrl: string = '';
  constructor(public dialog: MatDialog, private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.getuserdetails();
    const firebaseConfig = environment.firebaseConfig;
    initializeApp(firebaseConfig);
  }

  getuserdetails() {
    this.authUserDetails = JSON.parse(sessionStorage.getItem("authProviderUserData") || "");
    console.log(this.authUserDetails);
    if (this.authUserDetails) {
      this.imageUrl = this.authUserDetails.photoURL;
    }

  }

  signout() {
    const auth = getAuth();
    auth.signOut().then((res) => {
      sessionStorage.clear();
      this.router.navigateByUrl("profile/login");
      this.authService.setIsLoggedIn(false);

    }).catch((error) => {
    });


  }

}
