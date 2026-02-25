import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { Student, StudentFormData } from '../models/student.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#06b6d4'
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function randomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}


@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/student`;
  // Public readonly signals
   students = this.getStudents();


  getStudents(): Observable<Student[]> {
     return this.http.get<Student[]>(this.apiUrl);
  }

  getStudentById(id: string): Observable<Student | undefined> {
    const student =  this.http.get<Student>(this.apiUrl+"/"+id);
    return student;
  }

  createStudent(data: StudentFormData): Observable<Student> {

    return this.http.post<Student>(this.apiUrl,data);
  }

  updateStudent(id: string, data: Partial<StudentFormData>): Observable<Student> {

    return  this.http.put<Student>(this.apiUrl+"/"+id,data);
  }

  deleteStudent(id: string): Observable<void> {
   return  this.http.delete<void>(this.apiUrl+"/"+id);
  }


}
