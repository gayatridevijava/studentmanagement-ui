import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { CourseService } from '../../../core/services/course.service';
import { ToastService } from '../../../core/services/toast.service';
import { Student, StudentFormData } from '../../../core/models/student.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-student-form',
  standalone: false,
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEdit = signal(false);
  studentId = signal<string | null>(null);
  loading = signal(false);
  submitting = signal(false);
  courses = signal<Course[]>([]);

  ngOnInit(): void {
    this.buildForm();
    this.loadCourses();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.studentId.set(id);
      this.loadStudent(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      enrolledCourses: [[]]
    });
  }

  private loadCourses(): void {
   this.courseService.getCourses()
       .pipe(takeUntil(this.destroy$))
       .subscribe(courses => {
         const enrolledIds = new Set(
           (this.form.get('enrolledCourses')?.value || []).map((c: Course) => c.id)
         );
         this.courses.set(courses.map(course => ({
           ...course,
           alreadyEnrolled: enrolledIds.has(course.id)
         })));
       });
  }

  private loadStudent(id: string): void {
    this.loading.set(true);
    this.studentService.getStudentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (student) => {
          if (student) this.patchForm(student);
          else {
            this.toastService.error('Student not found');
            this.router.navigate(['/students']);
          }
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load student');
          this.loading.set(false);
        }
      });
  }

  private patchForm(student: Student): void {
    this.form.patchValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      address: student.address,
      enrolledCourses: student.enrolledCourses
    });
  }

  isCourseSelected(course: Course): boolean {
     const courses: Course[] = [...(this.form.get('enrolledCourses')?.value || [])];
     return courses.some((c: Course) => c.id === course.id);
  }

  toggleCourse(course: Course): void {
    if (course.alreadyEnrolled) return;
      const courses: Course[] = [...(this.form.get('enrolledCourses')?.value || [])];
      const idx = courses.findIndex(c => c.id === course.id);
      if (idx === -1) courses.push(course);
      else courses.splice(idx, 1);
      this.form.patchValue({ enrolledCourses: courses });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData: StudentFormData = this.form.value;

    const request$ = this.isEdit()
      ? this.studentService.updateStudent(this.studentId()!, formData)
      : this.studentService.createStudent(formData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (student) => {
        this.toastService.success(
          this.isEdit()
            ? `${student.firstName} ${student.lastName} updated`
            : `${student.firstName} ${student.lastName} created`
        );
        this.router.navigate(['/students']);
      },
      error: () => {
        this.toastService.error('Failed to save student');
        this.submitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }

  hasError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl.touched);
  }

  getError(field: string): string {
    const ctrl = this.form.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required']) return 'This field is required';
    if (ctrl.errors['email']) return 'Enter a valid email address';
    if (ctrl.errors['minlength']) return `Minimum ${ctrl.errors['minlength'].requiredLength} characters`;
    return 'Invalid value';
  }
}
