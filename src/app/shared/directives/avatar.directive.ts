import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAvatar]',
  standalone: false
})
export class AvatarDirective implements OnInit {
  @Input() appAvatar = '';        // initials or name
  @Input() avatarColor = '#6366f1';
  @Input() avatarSize = 40;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const initials = this.getInitials(this.appAvatar);

    this.renderer.setStyle(element, 'width', `${this.avatarSize}px`);
    this.renderer.setStyle(element, 'height', `${this.avatarSize}px`);
    this.renderer.setStyle(element, 'border-radius', '50%');
    this.renderer.setStyle(element, 'background-color', this.avatarColor);
    this.renderer.setStyle(element, 'color', '#ffffff');
    this.renderer.setStyle(element, 'display', 'flex');
    this.renderer.setStyle(element, 'align-items', 'center');
    this.renderer.setStyle(element, 'justify-content', 'center');
    this.renderer.setStyle(element, 'font-weight', '700');
    this.renderer.setStyle(element, 'font-size', `${this.avatarSize * 0.38}px`);
    this.renderer.setStyle(element, 'letter-spacing', '0.5px');
    this.renderer.setStyle(element, 'flex-shrink', '0');
    this.renderer.setStyle(element, 'user-select', 'none');
    this.renderer.setProperty(element, 'textContent', initials);
  }

  private getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
}
