import { Injectable } from '@angular/core';
import { ToastType } from '@app/shared/types';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ type: ToastType; message: string }>();
  toast$ = this.toastSubject.asObservable();

  show(type: ToastType, message: string) {
    this.toastSubject.next({ type, message });
  }
}
