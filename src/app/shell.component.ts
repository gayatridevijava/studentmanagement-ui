import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-shell',
  standalone: false,
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css']
})
export class ShellComponent {
  sidebarOpen = signal(true);
  today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
