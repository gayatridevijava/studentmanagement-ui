import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { ToastService } from '../../../core/services/toast.service';
import { Course, CourseFormData } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: false,
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  form!: FormGroup;
  isEdit = signal(false);
  courseId = signal<string | null>(null);
  loading = signal(false);
  submitting = signal(false);


  ngOnInit(): void {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit.set(true);
      this.courseId.set(id);
      this.loadCourse(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      instructor: ['', Validators.required],
      credits: [3, [Validators.required, Validators.min(1), Validators.max(12)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  private loadCourse(id: string): void {
    this.loading.set(true);
    this.courseService.getCourseById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (course) => {
          if (course) this.form.patchValue(course);
          else {
            this.toastService.error('Course not found');
            this.router.navigate(['/courses']);
          }
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load course');
          this.loading.set(false);
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const formData: CourseFormData = this.form.value;

    const request$ = this.isEdit()
      ? this.courseService.updateCourse(this.courseId()!, formData)
      : this.courseService.createCourse(formData);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (course) => {
        this.toastService.success(
          this.isEdit() ? `"${course.name}" updated` : `"${course.name}" created`
        );
        this.router.navigate(['/courses']);
      },
      error: () => {
        this.toastService.error('Failed to save course');
        this.submitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
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
    if (ctrl.errors['min']) return `Minimum value is ${ctrl.errors['min'].min}`;
    if (ctrl.errors['max']) return `Maximum value is ${ctrl.errors['max'].max}`;
    return 'Invalid value';
  }
}
