import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UploadProgressService {
  private progressSubject = new BehaviorSubject<number | null>(null);
  progress$ = this.progressSubject.asObservable();

  private typeSubject = new BehaviorSubject<'video' | 'thumbnail' | null>(null);
  uploadingType$ = this.typeSubject.asObservable();

  setProgress(value: number | null) {
    this.progressSubject.next(value);
  }

  setType(value: 'video' | 'thumbnail' | null) {
    this.typeSubject.next(value);
  }

  reset() {
    this.setProgress(null);
    this.setType(null);
  }
}
