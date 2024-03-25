import { Component, OnInit } from '@angular/core';
import { UserDetails } from './core/interfaces/user';
import { AuthService } from './core/services/auth/auth.service';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
 isGuestuserIn:boolean = false;

  constructor(private authService: AuthService, private location:LocationStrategy) {

   }
  ngOnInit(): void {

    this.location.onPopState(()=>{
      console.log("popstate");
      console.log(this.location.getBaseHref())

    })



    this.authService.initMasterData();

    let userDetails!: UserDetails;
    if (sessionStorage.getItem("userDetails")) {
      userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

      if (userDetails) {
        this.authService.setIsLoggedIn(true);
        this.authService.setProfileDetails(userDetails);
      }
      if(userDetails.isGuestUser){
        this.isGuestuserIn=true
      }
    }
    this.authService.getIsLoggedIn().subscribe(value => {
      this.isLoggedIn = value;
     
    }
    );

  }
}
