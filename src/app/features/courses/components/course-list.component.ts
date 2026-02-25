import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { ToastService } from '../../../core/services/toast.service';
import { Course, CourseFilters} from '../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  courses = signal<Course[]>([]);
  loading = signal(false);
  deleteTarget = signal<Course | null>(null);
  showDeleteDialog = signal(false);

  searchControl = new FormControl('');


  ngOnInit(): void {
    this.loadCourses();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadCourses());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCourses(): void {
    this.loading.set(true);
    const filters: CourseFilters = {
      search: this.searchControl.value || ''
    };
    this.courseService.getCourses(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.courses.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load courses');
          this.loading.set(false);
        }
      });
  }


  navigateToCreate(): void {
    this.router.navigate(['/courses/new']);
  }

  navigateToEdit(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/courses', id, 'edit']);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/courses', id]);
  }

  confirmDelete(course: Course, event: Event): void {
    event.stopPropagation();
    this.deleteTarget.set(course);
    this.showDeleteDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.courseService.deleteCourse(target.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success(`"${target.name}" deleted`);
          this.showDeleteDialog.set(false);
          this.deleteTarget.set(null);
          this.loadCourses();
        },
        error: () => this.toastService.error('Failed to delete course')
      });
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog.set(false);
    this.deleteTarget.set(null);
  }

  getCapacityPercent(course: Course): number {
    return Math.round((course.enrolledCount / course.capacity) * 100);
  }


}
