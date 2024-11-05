import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Student {
  id: number;
  name: string;
  sec: string;
  Attendnt: number;
}

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR';
  apiUrl2 = 'https://66cb41954290b1c4f199e054.mockapi.io/QR2';
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  editMode: { [key: number]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<Student[]>(this.apiUrl).subscribe(data1 => {
      this.http.get<Student[]>(this.apiUrl2).subscribe(data2 => {
        this.students = [...data1, ...data2];
        this.filteredStudents = this.students;
      }, error => {
        console.error('Error fetching data from API 2:', error);
      });
    }, error => {
      console.error('Error fetching data from API 1:', error);
    });
  }

  editStudent(studentId: number) {
    this.editMode[studentId] = true;
  }

  saveStudent(student: Student) {
    let apiUrlToUse = '';

    if (['SEC1', 'SEC2', 'SEC3'].includes(student.sec)) {
      apiUrlToUse = this.apiUrl;
    } else if (['SEC4', 'SEC5', 'SEC6'].includes(student.sec)) {
      apiUrlToUse = this.apiUrl2;
    } else {
      console.error('Invalid section:', student.sec);
      alert('Invalid section provided for the student.');
      return;
    }

    this.http.put<Student>(`${apiUrlToUse}/${student.id}`, student).subscribe(
      () => {
        this.editMode[student.id] = false;
      },
      error => {
        console.error('Error saving student data:', error);
        alert(`Error saving student data: ${error.message}`);
      }
    );
  }

  searchStudents() {
    if (this.searchTerm.trim() === '') {
      this.filteredStudents = this.students;
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.id.toString().includes(this.searchTerm) ||
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }


  // async resetAllAttendance() {
  //   // تصفير غياب جميع الطلاب محليًا
  //   this.students.forEach(student => student.Attendnt = 0);

  //   for (const student of this.students) {
  //     let apiUrlToUse = '';

  //     if (['SEC1', 'SEC2', 'SEC3'].includes(student.sec)) {
  //       apiUrlToUse = this.apiUrl;
  //     } else if (['SEC4', 'SEC5', 'SEC6'].includes(student.sec)) {
  //       apiUrlToUse = this.apiUrl2;
  //     } else {
  //       console.error('Invalid section:', student.sec);
  //       continue;
  //     }

  //     try {
  //       // إرسال الطلب لتحديث الغياب لكل طالب مع تأخير
  //       await this.http.put(`${apiUrlToUse}/${student.id}`, student).toPromise();
  //       console.log(`Attendance reset for student ID: ${student.id}`);

  //       // إضافة تأخير زمني قدره 200 مللي ثانية بين كل طلب
  //       await this.delay(200);
  //     } catch (error) {
  //       console.error(`Error updating attendance for student ID: ${student.id}`, error);
  //       alert(`Error updating attendance for student ID: ${student.id}`);
  //     }
  //   }

  //   alert('تم تصفير جميع الغياب وتحديث البيانات بنجاح!');
  // }

  // // دالة لتأخير التنفيذ
  // delay(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

}
