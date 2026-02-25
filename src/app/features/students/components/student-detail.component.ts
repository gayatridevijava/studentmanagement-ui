import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { ToastService } from '../../../core/services/toast.service';
import { Student } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-student-detail',
  standalone: false,
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  student = signal<Student | null>(null);
  enrolledCourses = signal<Course[]>([]);
  loading = signal(false);
  showDeleteDialog = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadStudent(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadStudent(id: string): void {
    this.loading.set(true);
    this.studentService.getStudentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (student) => {
          if (!student) {
            this.toastService.error('Student not found');
            this.router.navigate(['/students']);
            return;
          }
          this.student.set(student);
          this.loadEnrolledCourses(student.enrolledCourses);
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load student');
          this.loading.set(false);
        }
      });
  }

  private loadEnrolledCourses(courses: Course[]): void {
    const allCourses:Course[] = this.courseService.courses();
    this.enrolledCourses.set(allCourses.filter(c =>
           courses.map((ec: Course) => ec.id).includes(c.id)
         ));
  }

  navigateToEdit(): void {
    this.router.navigate(['/students', this.student()?.id, 'edit']);
  }

  unenrollFromCourse(courseId: string): void {
    const s = this.student();

  }

  onDeleteConfirmed(): void {
    const s = this.student();
    if (!s) return;
    this.studentService.deleteStudent(s.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success(`${s.firstName} ${s.lastName} deleted`);
          this.router.navigate(['/students']);
        },
        error: () => this.toastService.error('Failed to delete')
      });
  }

  getFullName(): string {
    const s = this.student();
    return s ? `${s.firstName} ${s.lastName}` : '';
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
