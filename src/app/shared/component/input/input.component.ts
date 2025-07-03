import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './input.component.html',
})
export class InputComponent {
  @Input() required: boolean = false;
  @Input() description: string = '';
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() errorMessages: { [key: string]: string } = {};

  // Helper function to extract object keys
  objectKeys(obj: any) {
    return Object.keys(obj);
  }
}
