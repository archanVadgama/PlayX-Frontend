import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {  RouterLink } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';
import { ForgotPasswordRequest, RegisterRequest } from '@app/auth/types/auth.types';
import { ButtonComponent } from '@app/shared/component/button/button.component';
import { InputComponent } from '@app/shared/component/input/input.component';
import { AppTitleService } from '@app/shared/service/app-title/app-title.service';
import { ToastService } from '@app/shared/service/toast/toast.service';
import { APIResponse } from '@app/shared/types';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule,ButtonComponent, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  
  constructor(
    private authService: AuthService,
    private appTitle: AppTitleService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
      this.appTitle.setTitle('Forgot Password')
  }

  isSubmitting = false;
  forgotPassword = new FormGroup({
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ],
    }),
  });

  submitForm() {
      if (this.forgotPassword.valid && !this.isSubmitting) {
        this.isSubmitting = true;

        const email  = this.forgotPassword.value as ForgotPasswordRequest;
  
        this.authService.forgotPassword(email).subscribe({
          next: (response: APIResponse<null>) => {
            if (response.status) {
              this.toast.show("success", response.message!);
              this.isSubmitting = false;
            }
          },
          error: (err) => {
            this.isSubmitting = false;
            if (err.error && err.error.data) {
              // Handle server-side errors and set them for the form fields
              Object.keys(err.error.data).forEach((field: string) => {
                const message = err.error.data[field];
                const control = this.forgotPassword.get(field);
                if (control) {
                  control.setErrors({ ...control.errors, serverError: message });
                }
              });
            }
            this.toast.show("error", err.error.message!);
          },
        });
      }
    }
}
