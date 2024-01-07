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
    this.authService.getIsLoggedIn().subscribe(value => this.isLoggedIn = value);

  }
}
