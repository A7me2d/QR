import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  email: string = '';
  password: string = '';
  addClass: string = '';
  showError: boolean = false;

  apiSigLink = 'https://66cb41954290b1c4f199e054.mockapi.io/Emails';
  private secretKey = 'mySecretKey123';

  constructor(private http: HttpClient) {}

  encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, this.secretKey).toString();
  }

  decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  signIn() {
    this.http.get<any[]>(this.apiSigLink).subscribe(users => {
      // العثور على المستخدم المطابق للبريد الإلكتروني
      const user = users.find(u => u.mail === this.email);

      if (user) {
        // فك تشفير كلمة المرور المخزنة للمستخدم
        const decryptedPassword = this.decryptPassword(user.password);

        // التحقق من مطابقة كلمة المرور المدخلة مع كلمة المرور المفككة
        if (this.password === decryptedPassword) {
          localStorage.setItem('email', this.email);
          localStorage.setItem('Mr Ahmed', user.name);
          alert('تم تسجيل الدخول بنجاح!');


          if (user.name === 'Ahmed Hany') {
            window.location.href = '/QR';
          } else if (user.name === 'mariam') {
            window.location.href = '/mariam';
          }
        } else {

          this.addClass = 'error';
          this.showError = true;
        }
      } else {

        this.addClass = 'error';
        this.showError = true;
      }
    });
  }
}
