import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

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
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR'; // استخدام endpoint واحد فقط
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  editMode: { [key: number]: boolean } = {};
  sortAscending: boolean = true; // لتمكين الترتيب التصاعدي أو التنازلي
  sortField: string | undefined;
  selectedSection: string = ''; // لتحديد القسم

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      if (data.length > 0) {
        this.students = data[0].student;
        this.filteredStudents = this.students;
        this.filterBySection();
        console.log('API Response:', this.students);
      } else {
        console.error('No data available');
      }
    }, error => {
      console.error('Error fetching data from API:', error);
    });
  }
  filterBySection() {
    if (this.selectedSection) {

      this.filteredStudents = this.students.filter(student => student.sec === this.selectedSection);
    } else {

      this.filteredStudents = this.students;
    }
  }


  editStudent(studentId: number) {
    this.editMode[studentId] = true;
  }
  saveAllStudents() {

    const updatedData = { student: this.students };

    this.http.put(`${this.apiUrl}/1`, updatedData).subscribe(
      () => {
        console.log('All students updated successfully!');


        this.students.forEach(student => {
          this.editMode[student.id] = false;
        });

       
        this.filteredStudents = [...this.students];
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

  async resetAllAttendance() {
    // تصفير غياب الطلاب الذين لديهم غياب فقط
    const studentsWithAbsence = this.students.filter(student => student.Attendnt > 0);

    if (studentsWithAbsence.length === 0) {
      alert('لا توجد أي تغييرات على الغياب');
      return; // إذا لم يكن هناك طلاب لديهم غياب، نوقف العملية
    }

    for (const student of studentsWithAbsence) {
      try {
        // تصفير الغياب محليًا
        student.Attendnt = 0;
      } catch (error) {
        console.error(`Error updating attendance for student ID: ${student.id}`, error);
        alert(`Error updating attendance for student ID: ${student.id}`);
      }
    }

    // الآن نقوم بتحديث جميع الطلاب دفعة واحدة
    this.saveAllStudents();

    alert('تم تصفير غياب الطلاب الذين لديهم غياب وتحديث البيانات بنجاح!');
  }

  // دالة لتأخير التنفيذ
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// نسخة للعرض فقط
sortStudentsByAttendance() {
  this.filteredStudents = [...this.students]; // إنشاء نسخة من البيانات الأصلية
  this.filteredStudents.sort((a, b) => {
    return this.sortAscending ? a.Attendnt - b.Attendnt : b.Attendnt - a.Attendnt;
  });
  this.sortAscending = !this.sortAscending; // عكس الترتيب عند كل نقر
}

sortStudents() {
  this.filteredStudents = [...this.students];
  this.filteredStudents.sort((a, b) => {
    if (this.sortField === 'Attendnt') {
      return this.sortAscending ? a.Attendnt - b.Attendnt : b.Attendnt - a.Attendnt;
    } else if (this.sortField === 'name') {
      return this.sortAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    } else if (this.sortField === 'sec') {
      return this.sortAscending ? a.sec.localeCompare(b.sec) : b.sec.localeCompare(a.sec);
    }
    return 0;
  });
  this.sortAscending = !this.sortAscending;
}

}
