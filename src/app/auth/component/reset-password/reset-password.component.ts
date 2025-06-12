import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthService } from "@app/auth/services/auth.service";
import { ResetPasswordRequest } from "@app/auth/types/auth.types";
import { ButtonComponent } from "@app/shared/component/button/button.component";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { APIResponse } from "@app/shared/types";
import { DividerModule } from "primeng/divider";
import { PasswordModule } from "primeng/password";

@Component({
  selector: "app-reset-password",
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonComponent,
    PasswordModule,
    DividerModule,
    CommonModule
  ],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private route: ActivatedRoute,
    private appTitle: AppTitleService
  ) {}
  isSubmitting = false;
  resetToken: string = '';

  ngOnInit(): void {
    this.appTitle.setTitle('Reset Password')
    this.resetToken = this.route.snapshot.paramMap.get('resetToken')!;
  }

  /**
   * This is the form group for the reset password form, it contains the password and confirmPassword fields.
   *
   * @memberof ResetPasswordComponent
   */
  resetPassword = new FormGroup({
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
    confirmPassword: new FormControl<string>("", {
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

  /**
   * This is a getter for the password control in the resetPassword form group.
   *
   * @readonly
   * @memberof ResetPasswordComponent
   */
  get passwordControl() {
    return this.resetPassword.get("password")!;
  }

  /**
   * This is a getter for the confirmPassword control in the resetPassword form group.
   *
   * @readonly
   * @memberof ResetPasswordComponent
   */
  get confirmPasswordControl() {
    return this.resetPassword.get("confirmPassword")!;
  }

  /**
   * This function will submit the form and hit reset password API, it will also check for the error and show it in the input.
   *
   * @return {*} 
   * @memberof ResetPasswordComponent
   */
  submitForm() {
    if (this.resetPassword.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      if(this.resetPassword.value.password !== this.resetPassword.value.confirmPassword) {
        this.isSubmitting = false;
        this.resetPassword.get('confirmPassword')?.setErrors({ mismatch: true });
        this.toast.show("error", "Password and Confirm Password do not match");
        return;
      }

      const formData = this.resetPassword.value as ResetPasswordRequest;
      this.authService.resetPassword(this.resetToken, formData).subscribe({
        next: (response: APIResponse<null>) => {
          if (response.status) {
            this.toast.show("success", response.message!);
            this.isSubmitting = false;
            this.router.navigate(["log-in"]);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error && err.error.data) {
            // Handle server-side errors and set them for the form fields
            Object.keys(err.error.data).forEach((field: string) => {
              const message = err.error.data[field];
              const control = this.resetPassword.get(field);
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
