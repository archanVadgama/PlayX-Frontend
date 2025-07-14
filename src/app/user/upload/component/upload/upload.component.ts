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
import { HttpClient, HttpRequest, HttpHeaders, HttpEventType } from "@angular/common/http";
import { UploadProgressService } from "@app/shared/service/upload-progress/upload-progress.service";

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
  uploadProgress = 0;
  uploadingType: 'video' | 'thumbnail' | null = null;
  videoFile!: File; // Declare videoFile property
  thumbnailFile!: File; // Declare thumbnailFile property
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
    private uploadVideo: UploadService,
    private appTitle: AppTitleService,
    private uploadProgressService: UploadProgressService
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
      this.fileValidator(["image/png", "image/jpg", "image/jpeg"], 5),
    ]),
    video: new FormControl<File | null>(null, [
      Validators.required,
      this.fileValidator(["video/mp4"], 500),
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
  fileValidator(allowedTypes: string[], maxSizeMB: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (file && file instanceof File) {
        const isValidType = allowedTypes.includes(file.type);
        const isValidSize = file.size <= maxSizeMB * 1024 * 1024;
        return isValidType && isValidSize ? null : {
          ...(isValidType ? {} : { invalidFileType: true }),
          ...(isValidSize ? {} : { fileTooLarge: true })
        };
      }
      return null;
    };
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
  
      this.videoFile = this.uploadVideoForm.get('video')?.value!;
      this.thumbnailFile = this.uploadVideoForm.get('thumbnail')?.value!;
  
      if (!this.videoFile || !this.thumbnailFile) {
        this.toast.show("error", "Both video and thumbnail files are required.");
        this.isSubmitting = false;
        return;
      }
  
      this.uploadVideo.uploadVideo(formData).subscribe({
        next: (response: APIResponse<any>) => {
          if (response.status && response.data) {
            const {
              videoUrl,
              thumbnailUrl,
              videoKey,
              thumbnailKey,
              videoId,
            } = response.data;
  
            this.toast.show("warning", "Upload started in background.");
            // ✅ FIRE-AND-FORGET: Upload in background
            setTimeout(() => {
              this.uploadToS3(this.thumbnailFile, thumbnailUrl, thumbnailKey, 'image/jpeg', formData, () => {
                this.uploadToS3(this.videoFile, videoUrl, videoKey, 'video/mp4', formData, () => {            

                  this.uploadVideo.confirmUpload(videoId).subscribe({
                    next: (confirmResponse: any) => {
                      if (confirmResponse.status) {
                        console.log("Upload confirmed successfully.");
                        this.toast.show("success", "Upload completed successfully");
                      } else {
                        this.toast.show("error", confirmResponse.message || "Failed to confirm upload.");
                      }
                    },
                    error: (confirmError) => {
                      console.error("Error confirming upload:", confirmError);
                      this.toast.show("error", "Failed to confirm upload.");
                    }
                  });

                });
              });
            }, 0); // ⏱️ Run in background
             // ⏱️ Push to event loop, run in background
  
            // ✅ Show success, redirect, reset
            this.isSubmitting = false;
            this.router.navigate(["/"]); // Redirect immediately
          } else {
            this.toast.show("error", "Upload initialization failed.");
            this.isSubmitting = false;
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          if (err.error?.data) {
            Object.keys(err.error.data).forEach((field: string) => {
              const message = err.error.data[field];
              const control = this.uploadVideoForm.get(field);
              if (control) {
                control.setErrors({ ...control.errors, serverError: message });
              }
            });
          }
          this.toast.show("error", err.error.message || "Unexpected error occurred.");
        },
      });
    }
  }
     
  uploadToS3(
    file: File,
    signedUrl: string,
    s3Key: string,
    contentType: string,
    metadata: UploadRequest,
    onComplete: () => void
  ) {
    this.uploadProgressService.setType(contentType === 'video/mp4' ? 'video' : 'thumbnail');
    console.log("Uploading Type:", contentType);

    const xhr = new XMLHttpRequest();
  
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((100 * event.loaded) / event.total);
        this.uploadProgressService.setProgress(percent);
      }
    });
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          this.uploadingType = null;
          this.uploadProgressService.setProgress(null);
          console.log("Upload complete.");
          onComplete();
        } else {
          this.uploadingType = null;
          this.uploadProgressService.setProgress(null);
          console.error("Upload failed", xhr.statusText);
          this.toast.show("error", `Upload failed: ${xhr.statusText}`);
          this.isSubmitting = false;
        }
      }
    };
  
    xhr.open("PUT", signedUrl, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.send(file);
  }
  
  

  goToHomePage() {
    this.router.navigate(["/"]);
  }
}
 