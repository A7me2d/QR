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
  filteredStudents: Student[] = []; // قائمة الطلاب المفلترة للبحث
  searchTerm: string = ''; // مصطلح البحث
  editMode: { [key: number]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    // Fetch data from both APIs and merge
    this.http.get<Student[]>(this.apiUrl).subscribe(data1 => {
      this.http.get<Student[]>(this.apiUrl2).subscribe(data2 => {
        this.students = [...data1, ...data2];
        this.filteredStudents = this.students; // تعيين الطلاب المفلترين إلى القائمة الكاملة عند التحميل
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
    // البحث عن الطلاب بناءً على الرقم التعريفي (ID) أو الكود
    if (this.searchTerm.trim() === '') {
      this.filteredStudents = this.students; // عرض جميع الطلاب إذا كان مصطلح البحث فارغًا
    } else {
      this.filteredStudents = this.students.filter(student =>
        student.id.toString().includes(this.searchTerm) || // البحث باستخدام الرقم التعريفي
        student.name.toLowerCase().includes(this.searchTerm.toLowerCase()) // البحث باستخدام الكود
      );
    }
  }
}
