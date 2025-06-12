import { Component, Input, forwardRef } from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
interface FileError {
  maxSize?: boolean;
  fileType?: boolean;
}
@Component({
  selector: "app-file-upload",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.css",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() type: "image" | "video" = "image";
  @Input() label: string = "Upload File";
  @Input() formControl!: FormControl;
  @Input() allowedTypes: string[] = [];
  @Input() maxSizeMB: number = 10;
  previewUrl: string | null = null;
  fileName: string | null = null;
  errorMessage: string | null = null;
  disabled = false;

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any): void {
    // Handle initial form value
    if (value) {
      this.handleFileSelection(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get allowedFileExtensions(): string {
    if (this.type === "image") {
      return ".jpg, .jpeg, .png";
    }
    return ".mp4";
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Mark as touched when file is selected
    this.formControl.markAsTouched();

    // Reset previous errors
    this.resetErrors();

    // Validate file type
    if (!this.allowedTypes.includes(file.type)) {
      this.setError(
        "fileType",
        `Invalid file type. Only ${this.allowedFileExtensions} files are allowed.`
      );
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > this.maxSizeMB) {
      this.setError(
        "maxSize",
        `File is too large. Maximum size allowed is ${this.maxSizeMB}MB`
      );
      return;
    }

    this.handleFileSelection(file);
  }

  private setError(type: "fileType" | "maxSize", message: string) {
    this.errorMessage = message;
    this.formControl.setErrors({ [type]: true });
    this.resetPreview();

    // Reset input value to allow selecting the same file again
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  }

  private resetErrors() {
    this.errorMessage = null;
    this.formControl.setErrors(null);
  }

  /**
   * Handles the file selection and updates the preview URL and file name.
   *
   * @private
   * @param {File} file
   * @memberof FileUploadComponent
   */
  private handleFileSelection(file: File) {
    // Create preview URL
    this.previewUrl = URL.createObjectURL(file);
    this.fileName = file.name;
    this.errorMessage = null;

    // Notify form of value change
    this.onChange(file);
    this.onTouch();

    // Update form control if provided
    if (this.formControl) {
      this.formControl.setValue(file);
    }
  }

  /**
   * Removes the selected file and resets the preview.
   *
   * @param {Event} event
   * @memberof FileUploadComponent
   */
  removeFile(event: Event) {
    event.stopPropagation();
    this.resetPreview();

    // Notify form of value change
    this.onChange(null);
    this.onTouch();

    // Update form control if provided
    if (this.formControl) {
      this.formControl.setValue(null);
    }
  }

  /**
   * Resets the preview, file name, and error message.
   *
   * @memberof FileUploadComponent
   */
  resetPreview() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.fileName = null;
    this.errorMessage = null;
  }

  ngOnDestroy() {
    this.resetPreview();
  }
}
