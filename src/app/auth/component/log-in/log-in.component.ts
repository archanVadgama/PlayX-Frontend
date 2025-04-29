import { Component } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { InputComponent } from "../../../shared/component/input/input.component";
import { ButtonComponent } from "../../../shared/component/button/button.component";
import { AuthService } from "../../services/auth.service";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { APIResponse } from "@app/shared/types";

import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { LogInRequest } from "@app/auth/types/auth.types";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    PasswordModule,
    DividerModule
  ],
  templateUrl: "./log-in.component.html",
  styleUrl: "./log-in.component.css",
})
export class LogInComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {}

  isSubmitting = false;

  loginForm = new FormGroup({
    username: new FormControl<string>("archanTest", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ],
    }),
    password: new FormControl<string>("Arc@123", {
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
    rememberMe: new FormControl<boolean>(false, { nonNullable: true }),
  });
  
  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  /**
   * This function will submit the form and hit login, it will also check for the error and show it in the input.
   *
   * @memberof LogInComponent
   */
  submitForm() {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const logInData = this.loginForm.value as LogInRequest;

      this.authService.logIn(logInData).subscribe({
        next: (response: APIResponse<null>) => {
          if (response.status) {
            this.toast.show("success", response.message!);
            this.isSubmitting = false;

            const accessToken = this.cookieService.get('accessToken');

            if (!accessToken) {
              console.log('No access token found',accessToken);
              this.router.navigate(['/log-in']);
            }

            try {
              // Verify the token and decode it
              if (this.jwtHelper.isTokenExpired(accessToken)) {
                this.router.navigate(['/log-in']);
              }
              
              // Get the payload from the token
              const decodedToken = this.jwtHelper.decodeToken(accessToken);
              // Check if user is admin
              if (decodedToken && decodedToken.isAdmin === true) {
                this.router.navigate(['/admin']); // Allow access to admin dashboard
              } else {
                this.router.navigate(["/"]); // Allow access to user dashboard
              }
            } catch (error) {
              // Error decoding the token
              console.error('Error verifying token:', error);
              this.router.navigate(['/']);
            }

          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error && err.error.data) {
            // Handle server-side errors and set them for the form fields
            Object.keys(err.error.data).forEach((field: string) => {
              const message = err.error.data[field];
              const control = this.loginForm.get(field);
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
