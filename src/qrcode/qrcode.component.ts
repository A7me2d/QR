import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as QRCode from 'qrcode';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';

interface Student {
  id: number;
  name: string;
  sec: string;
  Attendnt: number;
}

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QRcodeComponent {
  qrCodeUrl: string | null = null;
  scannedCode: string | null = null;
  studentData: Student | null = null;
  qrCodeReader: BrowserQRCodeReader;
  scannerControls: IScannerControls | null = null;
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR'; // Update your API URL

  constructor(private http: HttpClient) {
    this.qrCodeReader = new BrowserQRCodeReader();
  }

  generateQRCode(studentCode: string) {
    QRCode.toDataURL(studentCode, { errorCorrectionLevel: 'H' })
      .then(url => {
        this.qrCodeUrl = url;
      })
      .catch(error => {
        console.error('Error generating QR code:', error);
      });
  }

  startScan() {
    this.qrCodeReader.decodeFromVideoDevice(undefined, 'qr-video', (result, error, controls) => {
      if (controls) {
        this.scannerControls = controls;
      }
      if (result) {
        this.scannedCode = result.getText();
        if (this.scannerControls) {
          this.scannerControls.stop();
          this.getStudentData(this.scannedCode); // Fetch student data
        }
      } 
    });
  }




  getStudentData(studentId: string) {
    this.http.get<Student[]>(this.apiUrl).subscribe(data => {
      console.log('API Response:', data);

      const studentNumberId = Number(studentId); // تحويل id إلى عدد

      // العثور على الطالب في البيانات
      const student = data.find(s => Number(s.id) === studentNumberId); // تحويل id الطالب إلى عدد
      if (student) {
        student.Attendnt += 1; // زيادة عدد الحضور
        this.studentData = student; // تعيين بيانات الطالب
        console.log('Updated Student Data:', this.studentData.Attendnt);

        // الآن نقوم بتحديث بيانات الطالب في API
        this.updateStudentAttendance(student);
      } else {
        console.log('Student not found');
        this.studentData = null;
      }
    }, error => {
      console.error('Error fetching student data:', error);
    });
  }


  updateStudentAttendance(student: Student) {
    const updateUrl = `${this.apiUrl}/${student.id}`; // إنشاء URL صحيح للتحديث
    console.log('Updating student at URL:', updateUrl); // تسجيل URL لتصحيح الأخطاء
    console.log('Student to update:', student); // تسجيل بيانات الطالب لتصحيح الأخطاء

    // إرسال بيانات الطالب المحدثة إلى API
    this.http.put(updateUrl, student).subscribe(
      response => {
        console.log('Successfully updated student attendance:', response);
      },
      error => {
        console.error('Error updating student attendance:', error);
      }
    );
  }


}
