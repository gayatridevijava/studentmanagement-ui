import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../core/services/toast.service';
import { Course } from '../../../core/models/course.model';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-course-detail',
  standalone: false,
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  course = signal<Course | null>(null);
  enrolledStudents = signal<Student[]>([]);
  loading = signal(false);
  showDeleteDialog = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadCourse(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCourse(id: string): void {
    this.loading.set(true);
    this.courseService.getCourseById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (course) => {
          if (!course) {
            this.toastService.error('Course not found');
            this.router.navigate(['/courses']);
            return;
          }
          this.course.set(course);
          this.loadEnrolledStudents(course.enrolledStudents);
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load course');
          this.loading.set(false);
        }
      });
  }

  private loadEnrolledStudents(students: Student[]): void {
    this.enrolledStudents.set(students);
  }

  navigateToEdit(): void {
    this.router.navigate(['/courses', this.course()?.id, 'edit']);
  }

  onDeleteConfirmed(): void {
    const c = this.course();
    if (!c) return;
    this.courseService.deleteCourse(c.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success(`"${c.name}" deleted`);
          this.router.navigate(['/courses']);
        },
        error: () => this.toastService.error('Failed to delete')
      });
  }

  getCapacityPercent(): number {
    const c = this.course();
    if (!c) return 0;
    return Math.round((c.enrolledCount / c.capacity) * 100);
  }

  getStudentFullName(s: Student): string {
    return `${s.firstName} ${s.lastName}`;
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }
}
