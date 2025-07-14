import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-age-restricted',
  imports: [],
  templateUrl: './age-restricted.component.html',
  styleUrl: './age-restricted.component.css'
})
export class AgeRestrictedComponent {
isVisible = false
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  confirm() {
    this.confirmed.emit();
    this.close();
  }

  cancel() {
    this.cancelled.emit();
    this.close();
  }
}
