import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  Ahmed: boolean = false;
  mariam: boolean = false;

  signin: boolean = true;

  constructor() {}

  ngOnInit() {
    const userValue = localStorage.getItem('Mr Ahmed');
    if (userValue === 'Ahmed Hany') {
      this.Ahmed = true;
      this.signin = false;
    } else if (userValue === 'mariam') {
      this.mariam = true;
      this.signin = false;
    } else {
      this.Ahmed = false;
      this.mariam = false;
    }
  }


  logout() {

    localStorage.clear();
    this.Ahmed = false;
    this.mariam = false;
    window.location.href = '/sigin';
  }

}
