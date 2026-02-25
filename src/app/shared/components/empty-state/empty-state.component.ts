import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: false,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon }}</div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'No results found';
  @Input() message = 'Try adjusting your filters or add a new item.';
}
