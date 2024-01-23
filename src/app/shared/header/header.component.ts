import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserDetails } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  userDetails: UserDetails={
    userID: '',
    name: '',
    profileImage: '',
    }

  constructor(public dialog: MatDialog, private authService: AuthService) { }
  ngOnInit(): void {
  this.getuserdetails();
  }

  getuserdetails() {

    if (sessionStorage.getItem("userDetails")) {
      this.userDetails = JSON.parse(sessionStorage.getItem("userDetails") || "");
      console.log(this.userDetails);
    }
    
  }

 
}
