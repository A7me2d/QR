import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QRcodeComponent } from 'src/app/qrcode/qrcode.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { StudentComponent } from './student/student.component';
import { FormsModule } from '@angular/forms';
import { SigninComponent } from './signin/signin.component';
import { WebdevComponent } from './webdev/webdev.component';




@NgModule({
  declarations: [
    AppComponent,
    QRcodeComponent,
    NavbarComponent,
    FooterComponent,
    StudentComponent,
    SigninComponent,
    WebdevComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
