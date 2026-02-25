import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { AvatarDirective } from './directives/avatar.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';

const COMPONENTS = [
  ConfirmDialogComponent,
  ToastContainerComponent,
  SpinnerComponent,
  EmptyStateComponent
];

const DIRECTIVES = [
  AvatarDirective,
  ClickOutsideDirective
];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ...COMPONENTS,
    ...DIRECTIVES
  ]
})
export class SharedModule {}
