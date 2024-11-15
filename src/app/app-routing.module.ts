import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { QRcodeComponent } from 'src/app/qrcode/qrcode.component';
import { SigninComponent } from './signin/signin.component';
import { authGuard } from './auth.guard';
import { WebdevComponent } from './webdev/webdev.component';
import { MariamQRComponent } from './mariam-qr/mariam-qr.component';
import { ProgenglishComponent } from './progenglish/progenglish.component';

const routes: Routes = [
  { path: '' ,canActivate: [authGuard], component: QRcodeComponent},
  { path: 'student' ,canActivate: [authGuard], component: StudentComponent},
  { path: 'QR',canActivate: [authGuard], component : QRcodeComponent},
  { path: 'mariam',canActivate: [authGuard], component : MariamQRComponent},
  { path: 'progEng',canActivate: [authGuard], component : ProgenglishComponent},
  { path: 'Web',canActivate: [authGuard], component :WebdevComponent},
  { path: 'sigin',component : SigninComponent},
  { path: '##' ,canActivate: [authGuard], component: QRcodeComponent},
  { path: '**' ,canActivate: [authGuard], component: QRcodeComponent}
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
