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
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR/1';
  cours1 = 'https://66cb41954290b1c4f199e054.mockapi.io/QR/1';
  cours2 = 'https://66cb41954290b1c4f199e054.mockapi.io/QR/2';

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
    this.http.get<any>(this.apiUrl).subscribe(data => {
      // console.log(this.apiUrl);

      const students = data.student;

      // console.log(data.student);
      if (students) {
        const student = students.find((student: any) => student.id === studentId);

        if (student) {
          this.handleStudentFound(student);
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

    student.Attendnt += 1;
    this.studentData = student;

    this.updateStudentAttendance(student);
  }

  updateStudentAttendance(student: any) {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      const students = data.student;

      if (students) {
        const studentIndex = students.findIndex((s: { id: any; }) => s.id === student.id);

        if (studentIndex !== -1) {
          students[studentIndex].Attendnt = student.Attendnt;

          // استخدام apiUrl مباشرةً للتحديث
          this.http.put(this.apiUrl, { student: students }).subscribe(
            response => {
              console.log('Attendance updated successfully');
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



  onCourseChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.apiUrl = selectedValue === 'cours1' ? this.cours1 : this.cours2;
  }


}
