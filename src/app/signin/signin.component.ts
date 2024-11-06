import { Component } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  addClass: string = ''; // Used for setting error class
  showError: boolean = false; // Used to control visibility of error message

  // Simulate a set of valid credentials for demonstration purposes
  private validEmail = 'a@gmail.com';
  private validPassword = '1';

  constructor() {}

  signIn() {
    if (this.email === this.validEmail && this.password === this.validPassword) {
      // Store the email and token in localStorage
      localStorage.setItem('email', this.email);
      localStorage.setItem('Mr Ahmed', 'sampleToken123');

      // Redirect to '/QR'
      window.location.href = '/QR';

      alert('Sign-in successful!');
    } else {
      // Show error message and set error class
      this.addClass = 'error';
      this.showError = true;
    }
  }
}
