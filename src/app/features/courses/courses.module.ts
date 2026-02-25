import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CourseListComponent } from './components/course-list.component';
import { CourseFormComponent } from './components/course-form.component';
import { CourseDetailComponent } from './components/course-detail.component';

const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'new', component: CourseFormComponent },
  { path: ':id', component: CourseDetailComponent },
  { path: ':id/edit', component: CourseFormComponent }
];

@NgModule({
  declarations: [
    CourseListComponent,
    CourseFormComponent,
    CourseDetailComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class CoursesModule {}
