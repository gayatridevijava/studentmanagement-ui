import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { StudentListComponent } from './components/student-list.component';
import { StudentFormComponent } from './components/student-form.component';
import { StudentDetailComponent } from './components/student-detail.component';

const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'new', component: StudentFormComponent },
  { path: ':id', component: StudentDetailComponent },
  { path: ':id/edit', component: StudentFormComponent }
];

@NgModule({
  declarations: [
    StudentListComponent,
    StudentFormComponent,
    StudentDetailComponent
  ],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class StudentsModule {}
