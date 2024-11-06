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
  apiUrl = 'https://66cb41954290b1c4f199e054.mockapi.io/QR';
  apiUrl2 = 'https://66cb41954290b1c4f199e054.mockapi.io/QR2';
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  editMode: { [key: number]: boolean } = {};
  sortAscending: boolean = true; // لتمكين الترتيب التصاعدي أو التنازلي


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


  async resetAllAttendance() {
    // تصفير غياب الطلاب الذين لديهم غياب فقط
    const studentsWithAbsence = this.students.filter(student => student.Attendnt > 0);

    if (studentsWithAbsence.length === 0) {
      alert('لا توجد أي تغييرات على الغياب');
      return; // إذا لم يكن هناك طلاب لديهم غياب، نوقف العملية
    }

    for (const student of studentsWithAbsence) {
      let apiUrlToUse = '';

      if (['SEC1', 'SEC2', 'SEC3'].includes(student.sec)) {
        apiUrlToUse = this.apiUrl;
      } else if (['SEC4', 'SEC5', 'SEC6'].includes(student.sec)) {
        apiUrlToUse = this.apiUrl2;
      } else {
        console.error('Invalid section:', student.sec);
        continue;
      }

      try {
        // تصفير الغياب محليًا
        student.Attendnt = 0;

        // إرسال الطلب لتحديث غياب الطالب
        await this.http.put(`${apiUrlToUse}/${student.id}`, student).toPromise();
        console.log(`Attendance reset for student ID: ${student.id}`);

        // إضافة تأخير زمني قدره 200 مللي ثانية بين كل طلب
        await this.delay(200);
      } catch (error) {
        console.error(`Error updating attendance for student ID: ${student.id}`, error);
        alert(`Error updating attendance for student ID: ${student.id}`);
      }
    }

    alert('تم تصفير غياب الطلاب الذين لديهم غياب وتحديث البيانات بنجاح!');
  }

  // دالة لتأخير التنفيذ
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  sortStudentsByAttendance() {
    this.filteredStudents.sort((a, b) => {
      return this.sortAscending ? a.Attendnt - b.Attendnt : b.Attendnt - a.Attendnt;
    });
    this.sortAscending = !this.sortAscending; // عكس الترتيب عند كل نقر
  }


  // downloadStudentData() {
  //   // تحويل البيانات إلى ورقة Excel
  //   const worksheet = XLSX.utils.json_to_sheet(this.students);

  //   // ضبط المسافات (عرض الأعمدة)
  //   const columnWidths = [
  //     { wch: 10 }, // عرض العمود الأول (ID)
  //     { wch: 20 }, // عرض العمود الثاني (Name)
  //     { wch: 10 }, // عرض العمود الثالث (Section)
  //     { wch: 15 }  // عرض العمود الرابع (Attendance)
  //   ];

  //   worksheet['!cols'] = columnWidths; // تطبيق عرض الأعمدة

  //   // تنسيق الخلايا
  //   const headerStyle = {
  //     font: { bold: true }, // الخط عريض للعناوين
  //     alignment: { horizontal: 'center', vertical: 'center' }, // محاذاة النص إلى المنتصف
  //     fill: { fgColor: { rgb: 'FFFF00' } } // لون خلفية أصفر للعناوين
  //   };

  //   // تطبيق التنسيق على رأس الجدول
  //   const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  //   for (let col = range.s.c; col <= range.e.c; col++) {
  //     const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
  //     if (!worksheet[cellRef]) continue;
  //     worksheet[cellRef].s = headerStyle;
  //   }

  //   // إنشاء الكتاب (WorkBook)
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

  //   // تحويل الكتاب إلى ملف XLSX
  //   const excelFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  //   // إنشاء Blob وتحميل الملف
  //   const blob = new Blob([excelFile], { type: 'application/octet-stream' });
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'students_data.xlsx'; // اسم الملف
  //   link.click();
  // }



}
