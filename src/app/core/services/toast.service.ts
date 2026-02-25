import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string, duration = 3000): void {
    this.addToast('success', message, duration);
  }

  error(message: string, duration = 5000): void {
    this.addToast('error', message, duration);
  }

  warning(message: string, duration = 4000): void {
    this.addToast('warning', message, duration);
  }

  info(message: string, duration = 3000): void {
    this.addToast('info', message, duration);
  }

  dismiss(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  private addToast(type: ToastType, message: string, duration: number): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, type, message, duration };
    this.toastsSignal.update(toasts => [...toasts, toast]);
    setTimeout(() => this.dismiss(id), duration);
  }
}
