import { Component } from '@angular/core';
import { ReactiveFormsModule,FormControl,FormGroup } from '@angular/forms';
import { ButtonComponent } from '@app/shared/component/button/button.component';
import { InputComponent } from '@app/shared/component/input/input.component';

@Component({
  selector: 'app-profile',
  imports: [InputComponent,ButtonComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
