import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from "firebase/compat/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserRequest, GuestUserRequest } from 'src/app/core/interfaces/user';
import { LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isRegistered: any;
  user!: any;
  provider: any;
  Provider: any;
  authUserDetails: any;
  isGuestUser: boolean = false;
  guestID: any;
  returnUrl: string | null = "";
  constructor(private router: Router, private authService: AuthService, private afAuth: AngularFireAuth, private route: ActivatedRoute) { }

  async ngOnInit() {


    window.addEventListener('pageshow', () => {
      if (sessionStorage.getItem("userDetails") != null) {
        this.router.navigateByUrl('/user/dashboard');
      }
    });

    let routeSnapshot = this.route.snapshot.queryParams;
    if (routeSnapshot) {
      if (this.route.snapshot.queryParamMap.has("linkuser")) {
        this.isGuestUser = this.route.snapshot.queryParamMap.get("linkuser") === "true" ? true : false;
      }
      else if (this.route.snapshot.queryParamMap.has("returnUrl")) {
        this.returnUrl = this.route.snapshot.queryParamMap.get("returnUrl")
      }
    }

    this.Provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }

  googleLogin() {
    this.Provider.setCustomParameters({
      prompt: "select_account"
    });
    this.AuthLogin(new GoogleAuthProvider());
  }

  facebookLogin() {
    this.AuthLogin(new FacebookAuthProvider());
  }


  AuthLogin(provider: any) {
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);

        if (result.user !== null) {
          let providerData = result.user.providerData;
          if (providerData.length > 0) {
            sessionStorage.setItem('authProviderUserData', JSON.stringify(providerData[0]));
            const user: UserRequest = {
              emailid: providerData[0].email ? providerData[0].email : undefined,
              userid: providerData[0].uid
            };
            if (this.isGuestUser) {
              this.linkUser(user)
            }
            this.getUserDetails(user);
          }

        } else {
          this.router.navigateByUrl('/');
          localStorage.clear();

        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  signout() {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
    });
  }
  guestUserLogin() {

    const user: UserRequest = {
      userid: this.authService.generateUUIDForGuestUser(),
      isGuestUser: "Y"

    };
    this.getUserDetails(user);
  }


  getUserDetails(user: UserRequest) {
    this.authService.getUserDetails(user).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.commonEntity?.transactionStatus === "Y" && response.commonEntity?.message === "Success") {
          console.log(response.userDetailEntity);
          sessionStorage.setItem('userDetails', JSON.stringify(response.userDetailEntity[0]));
          this.authService.setIsLoggedIn(true);
          this.authService.setProfileDetails(response.userDetailEntity[0]);


          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          }
          else {
            if (response.userDetailEntity[0]?.isRegistered || response.userDetailEntity[0]?.isGuestUser === "Y") {
              this.router.navigateByUrl('/user/dashboard');
            }
            else {
              this.router.navigateByUrl('/profile/register');
            }
          }
        }
        else {
          this.afAuth.signOut().then(() => {
            window.alert('Logged out!');
          });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  linkUser(user: UserRequest) {
    const guestuser: GuestUserRequest = {
      oldId: this.authService.getUserId().userID,
      newId: user.userid,
      email: user.emailid
    };
    console.log(guestuser);

    this.authService.linkUserDetails(guestuser).subscribe((response: any) => {
      console.log(response);
      if (response.transactionStatus == "Y" && response.message == "Success") {

        const updateuser: UserRequest = {
          emailid: user.emailid,
          userid: user.userid,
          isGuestUser: "N"
        }
        console.log(user);
        this.getUserDetails(updateuser);
      }
    })

  }
}


