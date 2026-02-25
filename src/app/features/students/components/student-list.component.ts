import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';
import { ToastService } from '../../../core/services/toast.service';
import { Student} from '../../../core/models/student.model';

@Component({
  selector: 'app-student-list',
  standalone: false,
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  students = signal<Student[]>([]);
  loading = signal(false);
  deleteTarget = signal<Student | null>(null);
  showDeleteDialog = signal(false);
  viewMode = signal<'grid' | 'table'>('grid');

  searchControl = new FormControl('');


  ngOnInit(): void {
    this.loadStudents();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.loadStudents());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.loading.set(true);

    this.studentService.getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.students.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.toastService.error('Failed to load students');
          this.loading.set(false);
        }
      });
  }


  navigateToCreate(): void {
    this.router.navigate(['/students/new']);
  }

  navigateToEdit(id: string): void {
    this.router.navigate(['/students', id, 'edit']);
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['/students', id]);
  }

  confirmDelete(student: Student): void {
    alert(student.firstName)
    this.deleteTarget.set(student);
    this.showDeleteDialog.set(true);
  }

  onDeleteConfirmed(): void {
    const target = this.deleteTarget();
    if (!target) return;
    this.studentService.deleteStudent(target.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.toastService.success(`${target.firstName} ${target.lastName} deleted`);
          this.showDeleteDialog.set(false);
          this.deleteTarget.set(null);
          this.loadStudents();
        },
        error: () => this.toastService.error('Failed to delete student')
      });
  }

  onDeleteCancelled(): void {
    this.showDeleteDialog.set(false);
    this.deleteTarget.set(null);
  }

  getFullName(s: Student): string {
    return `${s.firstName} ${s.lastName}`;
  }

  getCourseCount(s: Student): number {
    return s.enrolledCourses ? s.enrolledCourses.length:0;
  }
}
