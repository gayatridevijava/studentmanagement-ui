import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);


  // Summary stats from signals
  readonly totalCourses = this.courseService.totalCourses;
  totalStudents = signal<number>(0);



  ngOnInit(): void {
    this.studentService.getStudents().subscribe(data => {
      const students = data;
      this.totalStudents.set(students.length);  // get length here
    });
    const courses = this.courseService.courses();
  }

  getStudentFullName(s: Student): string {
    return `${s.firstName} ${s.lastName}`;
  }
}
