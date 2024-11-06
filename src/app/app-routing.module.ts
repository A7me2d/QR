import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { QRcodeComponent } from 'src/qrcode/qrcode.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth.guard';

const routes: Routes = [
  { path: '' ,canActivate: [authGuard], component: QRcodeComponent},
  { path: 'student' ,canActivate: [authGuard], component: StudentComponent},
  { path: 'QR',canActivate: [authGuard], component : QRcodeComponent},
  { path: 'sigin',component : SigninComponent},
  { path: '##' ,canActivate: [authGuard], component: QRcodeComponent},
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
