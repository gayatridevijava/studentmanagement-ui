import { Course } from './course.model';


export interface Student {
  id: string
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  enrolledCourses: Course[];
}


export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  enrolledCourseIds: string[];
}

export interface StudentFilters {
  search?: string;
  courseId?: string;
  sortBy?: keyof Student;
  sortOrder?: 'asc' | 'desc';
}
