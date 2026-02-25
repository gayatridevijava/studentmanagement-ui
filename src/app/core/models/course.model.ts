import { Student } from './student.model';


export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  enrolledStudents: Student[];
  status: string;
  instructor: string;
  credits: number;
  capacity: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  schedule: string;
  alreadyEnrolled?: boolean;
  createdAt: string;
  updatedAt: string;


}

export interface CourseFormData {
  code: string;
  name: string;
  description: string;
  instructor: string;
  credits: number;
  startDate: string;
  endDate: string;
  schedule: string;
}

export interface CourseFilters {
  search?: string;
  status?:  '';
  sortBy?: keyof Course;
  sortOrder?: 'asc' | 'desc';
}
