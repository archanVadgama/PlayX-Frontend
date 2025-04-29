import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@app/auth/services/auth.service";
import { RegisterRequest } from "@app/auth/types/auth.types";
import { ButtonComponent } from "@app/shared/component/button/button.component";
import { InputComponent } from "@app/shared/component/input/input.component";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { APIResponse } from "@app/shared/types";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";

@Component({
  selector: "app-sign-up",
  imports: [
    RouterLink,
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: "./sign-up.component.html",
  styleUrl: "./sign-up.component.css",
})
export class SignUpComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  isSubmitting = false;
  signupForm = new FormGroup({
    displayName: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ],
    }),
    username: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    }),
    email: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ],
    }),
    mobileNumber: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[6-9]\d{9}$/)
      ],
    }),
    password: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(12),
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,12}$/
        ),
      ],
    }),
  });

  get passwordControl() {
    return this.signupForm.get("password")!;
  }

  /**
   * This function will submit the form and hit login, it will also check for the error and show it in the input.
   *
   * @memberof LogInComponent
   */
  submitForm() {
    if (this.signupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = this.signupForm.value as RegisterRequest;

      this.authService.signUp(formData).subscribe({
        next: (response: APIResponse<null>) => {
          if (response.status) {
            this.toast.show("success", response.message!);
            this.isSubmitting = false;
            this.router.navigate(["/log-in"]);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error && err.error.data) {
            // Handle server-side errors and set them for the form fields
            Object.keys(err.error.data).forEach((field: string) => {
              const message = err.error.data[field];
              const control = this.signupForm.get(field);
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
