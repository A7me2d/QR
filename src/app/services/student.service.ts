import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

interface Student {
  id: number;
  name: string;
  sec: string;
  Attendnt: number;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl;
  private apiUrl2 = environment.apiUrl2;

  constructor(private http: HttpClient) {}

  // دالة لجلب بيانات الطلاب من الـ API الأول
  getStudentsFromFirstAPI(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // دالة لجلب بيانات الطلاب من الـ API الثاني
  getStudentsFromSecondAPI(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl2);
  }

  // دالة لتحديث حضور الطالب
  updateStudentAttendance(student: Student): Observable<Student> {
    const updateUrl = `${this.apiUrl}/${student.id}`;
    const updateUrl2 = `${this.apiUrl2}/${student.id}`;

    return this.http.put<Student>(updateUrl, student);
  }
}
