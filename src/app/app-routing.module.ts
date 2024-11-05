import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { QRcodeComponent } from 'src/qrcode/qrcode.component';

const routes: Routes = [
  { path: '' , component: QRcodeComponent},
  { path: '##' , component: QRcodeComponent},
  { path: 'student' , component: StudentComponent},
  { path: 'QR', component : QRcodeComponent},
];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
