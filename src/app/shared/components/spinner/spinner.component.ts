import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: false,
  template: `
    <div class="spinner-wrapper" [class.spinner-overlay]="overlay">
      <div class="spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <span *ngIf="message" class="spinner-message">{{ message }}</span>
    </div>
  `,
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  @Input() size = 36;
  @Input() overlay = false;
  @Input() message = '';
}
