import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/component/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  @ViewChild('toastRef') toast!: ToastComponent;
}
