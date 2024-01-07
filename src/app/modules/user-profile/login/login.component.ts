import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import firebase from "firebase/compat/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserRequest } from 'src/app/core/interfaces/user';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isRegistered: any
  user!: any;
  provider: any;
  Provider: any;
  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private afAuth: AngularFireAuth,) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // password: ['', Validators.required],
    });
    this.Provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }
  getUserData(providerData: any) {
    const user: UserRequest = {
      emailid: providerData.email,
      userid: providerData.uid
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
          else {
            this.router.navigateByUrl('/profile/register');
          }
        }
        else {
          // this.afAuth.signOut().then(() => {
          //   window.alert('Logged out!');
          // });
        }
      },
      // error: (err) => {
      //   console.error(err);
      // },
    });

  }
  googleLogin() {
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

            this.getUserData(providerData[0]);
          }

          // this.router.navigateByUrl('/profile/register');
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
    this.router.navigateByUrl('/profile/register');
  }
  createAccount() {
    this.router.navigateByUrl('/profile/register');
  }

}
