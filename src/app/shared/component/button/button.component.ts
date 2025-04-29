import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  // Input properties to make button dynamic
  @Input() type: string = 'button'; // default type is 'button'
  @Input() text: string = 'Button';
  @Input() color: string = 'primary'; // Default color scheme (primary)
  @Input() fullWidth: boolean = false; // Whether the button takes the full width of its container
  @Input() loading: boolean = false; // If true, show loading spinner (optional)
  @Input() disabled: boolean = false; // If true, disable the button (optional)
}
