import { Component, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonComponent } from "@app/shared/component/button/button.component";
import { InputComponent } from "@app/shared/component/input/input.component";
import { TextareaComponent } from "@app/shared/component/textarea/textarea.component";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { APIResponse } from "@app/shared/types";
import { UploadService } from "../../service/upload.service";
import { CommonModule } from "@angular/common";
import { FileUploadComponent } from "@app/shared/component/file-upload/file-upload.component";
import { UploadRequest } from "../../types/upload.types";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";

@Component({
  selector: "app-upload",
  imports: [
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    TextareaComponent,
    FileUploadComponent,
  ],
  templateUrl: "./upload.component.html",
  styleUrl: "./upload.component.css",
})
export class UploadComponent implements OnInit{
  isSubmitting = false;
  isAgeRestricted = false;
  isPrivate = false;
  constructor(
    private router: Router,
    private toast: ToastService,
    private uploadVideo: UploadService,
    private appTitle: AppTitleService
  ) {}

  ngOnInit(): void {
    this.appTitle.setTitle('Upload Video');
  }

  uploadVideoForm = new FormGroup({
    title: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(80),
      ],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    }),
    keywords: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
        Validators.pattern(/^(\s*\w+\s*)(,\s*\w+\s*)*$/), // Pattern for comma-separated values
      ],
    }),
    thumbnail: new FormControl<File | null>(null, [
      Validators.required,
      this.fileTypeValidator(["image/png", "image/jpg", "image/jpeg"]),
    ]),
    video: new FormControl<File | null>(null, [
      Validators.required,
      this.fileTypeValidator(["video/mp4"]),
    ]),
    isAgeRestricted: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [],
    }),
    isPrivate: new FormControl<boolean>(false, {
      nonNullable: true,
      validators: [],
    }),
    categoryId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.max(10)],
    }),
  });

  /**
   * This function validates the file type of the uploaded file.
   *
   * @param {string[]} allowedTypes
   * @return {*} 
   * @memberof UploadComponent
   */
  fileTypeValidator(allowedTypes: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file instanceof File) {
        const isValidType = allowedTypes.includes(file.type);
        return isValidType ? null : { invalidFileType: true };
      }
      return null;
    };
  }

  /**
   * This function handles the change event for the thumbnail file input.
   *
   * @param {KeyboardEvent} event
   * @return {*}  {void}
   * @memberof UploadComponent
   */
  onKeywordsInput(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const cursorPosition = input.selectionStart ?? value.length;

    // Disallow special characters (except comma), and no spaces
    const allowedKeys = /^[a-zA-Z0-9,]$/;

    // Allow Backspace/Delete for cleanup logic
    if (event.key === "Backspace") {
      const prevChar = value[cursorPosition - 1];
      const prevPrevChar = value[cursorPosition - 2];

      // If deleting space after comma, delete both
      if (prevChar === " " && prevPrevChar === ",") {
        event.preventDefault();
        input.value =
          value.slice(0, cursorPosition - 2) + value.slice(cursorPosition);
        input.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
        this.uploadVideoForm.controls["keywords"].setValue(input.value);
      }
      return;
    }

    // Allow comma key and insert ", "
    if (event.key === ",") {
      event.preventDefault();
      const before = value.slice(0, cursorPosition).trimEnd();
      const after = value.slice(cursorPosition).trimStart();
      input.value = `${before}, ${after}`;
      const newCursorPosition = before.length + 2;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
      this.uploadVideoForm.controls["keywords"].setValue(input.value);
      return;
    }

    // Block space and disallowed special characters
    if (event.key === " " || !allowedKeys.test(event.key)) {
      event.preventDefault();
      return;
    }
  }

  /**
   * This function will submit the form and hit the upload video API.
   *
   * @memberof UploadComponent
   */
  submitForm() {
    if (this.uploadVideoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = this.uploadVideoForm.value as UploadRequest;
      this.uploadVideo.uploadVideo(formData).subscribe({
        next: (response: APIResponse<null>) => {
          if (response.status) {
            this.toast.show("success", response.message!);
            this.isSubmitting = false;
            this.router.navigate(["/"]);
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error && err.error.data) {
            // Handle server-side errors and set them for the form fields
            Object.keys(err.error.data).forEach((field: string) => {
              const message = err.error.data[field];
              const control = this.uploadVideoForm.get(field);
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

  goToHomePage() {
    this.router.navigate(["/"]);
  }
}
