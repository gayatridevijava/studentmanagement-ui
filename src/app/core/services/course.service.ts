import { Injectable, signal, computed,inject } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { Course, CourseFormData, CourseFilters} from '../models/course.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { toSignal } from '@angular/core/rxjs-interop';


// NOTE: Replace method internals with HttpClient calls when integrating backend.

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/course`;
  private coursesSignal = signal<Course[]>([]);

  readonly courses= this.coursesSignal.asReadonly();
  readonly totalCourses = computed(() => this.coursesSignal().length);
  readonly activeCourses = computed(() =>
    this.coursesSignal().filter((c: Course) => c.status === 'active').length
  );

constructor() {
  this.http.get<Course[]>(this.apiUrl).subscribe((courses: Course[]) =>{
      this.coursesSignal.set(courses);
    }
  );
}

  getCourses(filters?: CourseFilters): Observable<Course[]> {
        return this.http.get<Course[]>(this.apiUrl);
    }

  getCourseById(id: string): Observable<Course | undefined> {
    return this.http.get<Course>(this.apiUrl+"/"+id);
  }

  createCourse(data: CourseFormData): Observable<Course> {

     return this.http.post<Course>(this.apiUrl,data);
  }

  updateCourse(id: string, data: Partial<CourseFormData>): Observable<Course> {
    const courses: Course[] = this.coursesSignal();
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) {
      return throwError(() => new Error(`Course with id ${id} not found`));
    }
    const updated: Course = {
      ...courses[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };
    this.coursesSignal.update((list: Course[]) => list.map((c: Course) => c.id === id ? updated : c));
    return of(updated).pipe(delay(200));
  }

  deleteCourse(id: string): Observable<void> {
    this.coursesSignal.update((courses: Course[]) => courses.filter((c: Course) => c.id !== id));
    return of(undefined).pipe(delay(200));
  }

  incrementEnrolledCount(courseId: string): void {
    this.coursesSignal.update((courses: Course[]) =>
      courses.map((c: Course) => c.id === courseId
        ? { ...c, enrolledCount: c.enrolledCount + 1 }
        : c
      )
    );
  }

  decrementEnrolledCount(courseId: string): void {
    this.coursesSignal.update((courses: Course[]) => courses.map((c: Course) =>
      c.id === courseId         // condition
        ? { ...c, enrolledCount: Math.max(0, c.enrolledCount - 1) }
        : c
        ));


}
}
