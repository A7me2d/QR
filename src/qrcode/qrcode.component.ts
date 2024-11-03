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
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR'; // First API URL
  apiUrl2 = 'https://66cb41954290b1c4f199e054.mockapi.io/QR2'; // Second API URL

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
    const studentNumberId = Number(studentId); // Convert id to a number

    // First, fetch from the first API endpoint
    this.http.get<Student[]>(this.apiUrl).subscribe(data => {
      // console.log('API Response from QR:', data);

      // Check for the student in the first data set
      let student = data.find(s => Number(s.id) === studentNumberId);

      if (student) {
        this.handleStudentFound(student); // Handle the found student
      } else {
        // If not found, fetch from the second API endpoint
        this.http.get<Student[]>(this.apiUrl2).subscribe(data2 => {
          // console.log('API Response from QR2:', data2);

          student = data2.find(s => Number(s.id) === studentNumberId);
          if (student) {
            this.handleStudentFound(student); // Handle the found student
          } else {
            console.log('Student not found in either API');
            this.studentData = null;
          }
        }, error => {
          console.error('Error fetching student data from QR2:', error);
        });
      }
    }, error => {
      console.error('Error fetching student data from QR:', error);
    });
}

handleStudentFound(student: Student) {
    student.Attendnt += 1; // Increase attendance
    this.studentData = student; // Assign the student data
    console.log('Updated Student Data:', this.studentData.Attendnt);

    // Update the student's attendance in the corresponding API
    this.updateStudentAttendance(student);
}

updateStudentAttendance(student: Student) {
  const updateUrl = `${this.apiUrl}/${student.id}`; // URL for the first API
  const updateUrl2 = `${this.apiUrl2}/${student.id}`; // URL for the second API

  // Check if the student exists in the first API
  this.http.get<Student[]>(this.apiUrl).subscribe(data => {
      const existsInFirstApi = data.some(s => s.id === student.id);

      if (existsInFirstApi) {
          // Update the first API if the student exists there
          this.http.put(updateUrl, student).subscribe(
              response => {
                  // console.log('Successfully updated student attendance in the first API:', response);
              },
              error => {
                  console.error('Error updating student attendance in the first API:', error);
              }
          );
      } else {
          // If not found in the first API, update the second API
          this.http.put(updateUrl2, student).subscribe(
              response => {
                  // console.log('Successfully updated student attendance in the second API:', response);
              },
              error => {
                  console.error('Error updating student attendance in the second API:', error);
              }
          );
      }
  }, error => {
      console.error('Error fetching student data from the first API for update:', error);
  });
}


}
