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
      }, error => {
        console.error('Error fetching data from API 2:', error);
      });
    }, error => {
      console.error('Error fetching data from API 1:', error);
    });
  }

  editStudent(studentId: number) {
    // Enable edit mode for the student
    this.editMode[studentId] = true;
  }


  saveStudent(student: Student) {
    // تحديد الرابط الصحيح بناءً على sec
    let apiUrlToUse = '';

    // تحديد الرابط بناءً على قيمة sec
    if (['SEC1', 'SEC2', 'SEC3'].includes(student.sec)) {
      apiUrlToUse = this.apiUrl; // استخدم apiUrl للرابط الأول
    } else if (['SEC4', 'SEC5', 'SEC6'].includes(student.sec)) {
      apiUrlToUse = this.apiUrl2; // استخدم apiUrl2 للرابط الثاني
    } else {
      console.error('Invalid section:', student.sec); // سجل خطأ إذا كانت القيمة غير صحيحة
      alert('Invalid section provided for the student.'); // عرض رسالة خطأ للمستخدم
      return; // خروج من الدالة إذا كانت القيمة غير صحيحة
    }

    // console.log('Saving student to:', apiUrlToUse); // طباعة الرابط المستخدم
    // console.log('Student data:', student); // طباعة بيانات الطالب

    this.http.put<Student>(`${apiUrlToUse}/${student.id}`, student).subscribe(
      () => {
        // تعطيل وضع التعديل بعد الحفظ
        this.editMode[student.id] = false;
        // console.log('Student data saved successfully:', student);
      },
      error => {
        console.error('Error saving student data:', error); // سجل الخطأ
        alert(`Error saving student data: ${error.message}`); // عرض الخطأ للمستخدم
      }
    );
  }



}
