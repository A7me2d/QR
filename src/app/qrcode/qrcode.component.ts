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
  selectedSubject: string = 'web'; // المادة المحددة

  constructor(private http: HttpClient) {
    this.qrCodeReader = new BrowserQRCodeReader();
  }

  getApiUrl(): string {
    return this.selectedSubject === 'web'
      ? 'https://66cb41954290b1c4f199e054.mockapi.io/QR'
      : 'https://66cb41954290b1c4f199e054.mockapi.io/QR';
  }

  getUpdateUrl(): string {
    return this.selectedSubject === 'web'
      ? 'https://66cb41954290b1c4f199e054.mockapi.io/QR/2'
      : 'https://66cb41954290b1c4f199e054.mockapi.io/QR/1';
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
          this.getStudentData(this.scannedCode);
        }
      }
    });
  }

  getStudentData(studentId: string) {
    const apiUrl = this.getApiUrl(); // الحصول على رابط الـ API المناسب

    this.http.get<any[]>(apiUrl).subscribe(data => {
      const students = data[0]?.student;

      if (students) {
        let student = students.find((student: any) => student.id === studentId);
        if (student) {
          this.handleStudentFound(student, students);
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

  handleStudentFound(student: any, students: any[]) {
    student.Attendnt += 1;
    this.studentData = student;
    this.updateStudentAttendance(students);
  }

  updateStudentAttendance(students: any[]) {
    const updateUrl = this.getUpdateUrl(); // استخدام الرابط المناسب لرفع الغياب

    this.http.put(updateUrl, { student: students }).subscribe(
      response => {
        console.log('Successfully updated student attendance:', response);
      },
      error => {
        console.error('Error updating student attendance:', error);
      }
    );
  }
}
