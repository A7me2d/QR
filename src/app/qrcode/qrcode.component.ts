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
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR'; // New API URL

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
    // جلب البيانات من الـ API
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      // console.log('Fetched data from API:', data); // تحقق من البيانات المسترجعة

      // الوصول إلى المصفوفة داخل data[0].student
      const students = data[0]?.student; // تأكد من وجود البيانات في المصفوفة

      if (students) {
        // البحث عن الطالب في المصفوفة باستخدام id
        let student = students.find((student: any) => student.id === studentId);  // قارن الـ id كمجموعة نصية

        if (student) {
          this.handleStudentFound(student); // إذا تم العثور على الطالب
        } else {
          console.log('Student not found in the API');
          this.studentData = null;
        }
      } else {
        console.log('No students data found in the API');
      }
    }, error => {
      console.error('Error fetching student data from API:', error);
    });
  }


  handleStudentFound(student: any) {
    // زيادة عدد الحضور فقط للطالب الذي تم مسحه
    student.Attendnt += 1;
    this.studentData = student; // تعيين البيانات المسترجعة في متغير studentData
    // console.log('Updated Student Data:', this.studentData);

    // تحديث بيانات الطالب فقط في الـ API
    this.updateStudentAttendance(student);
  }

  updateStudentAttendance(student: any) {
    // جلب البيانات الحالية لجميع الطلاب من الـ API
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      // console.log('Fetched data from API:', data); // تحقق من البيانات المسترجعة

      const students = data[0]?.student; // الوصول إلى المصفوفة داخل data[0].student

      if (students) {
        // العثور على الطالب الذي تم مسحه بناءً على الـ id
        const studentIndex = students.findIndex((s: { id: any; }) => s.id === student.id);

        if (studentIndex !== -1) {
          // إذا تم العثور على الطالب، نقوم بتحديث الحضور فقط
          students[studentIndex].Attendnt = student.Attendnt; // تحديث الـ Attendnt للطالب فقط

          // إرسال البيانات المحدثة إلى الـ API
          this.http.put(`${this.apiUrl}/1`, { student: students }).subscribe(
            response => {
              // console.log('Successfully updated student attendance:', response);
            },
            error => {
              console.error('Error updating student attendance:', error);
            }
          );
        }
      } else {
        console.log('No students data found in the API');
      }
    }, error => {
      console.error('Error fetching student data from API:', error);
    });
  }

}
