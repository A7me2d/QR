import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor() {}

  ngOnInit() {
    // Check if the token exists in local storage
    this.isLoggedIn = localStorage.getItem('Mr Ahmed') !== null;
  }

  logout() {
    // Clear all data from local storage
    localStorage.clear();
    this.isLoggedIn = false;
    window.location.href = '/sigin';
  }

}
