import { Component, OnInit } from '@angular/core';
import { UserDetails } from './core/interfaces/user';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }
  ngOnInit(): void {

    let userDetails!: UserDetails;
    if (sessionStorage.getItem("userDetails")) {
      userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");

      if (userDetails) {
        this.authService.setIsLoggedIn(true);
      }
    }
    this.authService.getIsLoggedIn().subscribe(value => {
      console.log(value);
      this.isLoggedIn = value
    }
    );

  }
}
