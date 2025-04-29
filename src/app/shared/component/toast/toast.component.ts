import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ToastService } from "@app/shared/service/toast/toast.service";
import { ToastType } from "@app/shared/types";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-toast",
  imports: [CommonModule],
  templateUrl: "./toast.component.html",
  styleUrl: "./toast.component.css",
})
export class ToastComponent implements OnInit {
  show = false;
  title = "";
  progress = 100;
  state: ToastType = "success";

  private timer: any;
  private interval = 50;
  private duration = 3000;
  private remainingTime = this.duration;
  private lastTick = Date.now();
  private isPaused = false;

  showAnimation = false;
  hideAnimation = false;

  constructor(
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(({ type, message }) => {
      this.state = type;
      this.title = message;
      this.progress = 100;
      this.show = true;
      this.showAnimation = true;
      this.hideAnimation = false;
      this.remainingTime = this.duration;
      this.startTimer();
    });
  }

  startTimer() {
    this.lastTick = Date.now();
    clearInterval(this.timer);

    const step = (this.interval / this.duration) * 100;

    this.timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastTick;
      this.lastTick = now;

      if (!this.isPaused) {
        this.remainingTime -= elapsed;
        this.progress -= (elapsed / this.duration) * 100;

        if (this.remainingTime <= 0 || this.progress <= 0) {
          this.closeToast();
        }
      }
    }, this.interval);

    setTimeout(() => {
      if (!this.isPaused) {
        this.showAnimation = false;
        this.hideAnimation = true;
      }
    }, this.duration - 100);
  }

  pauseTimer() {
    this.isPaused = true;
  }

  resumeTimer() {
    if (this.remainingTime <= 0) return;
    this.isPaused = false;
    this.lastTick = Date.now();
  }

  closeToast() {
    clearInterval(this.timer);
    this.show = false;
  }

  get icon(): SafeHtml {
    let svg = "";
    switch (this.state) {
      case "success":
        svg = `
          <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;
        break;
      case "error":
        svg = `
            <svg class="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="9" stroke-width="2" />
              <line x1="15" y1="9" x2="9" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="9" y1="9" x2="15" y2="15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`;
        break;
      case "warning":
        svg = `
          <svg class="h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>`;
        break;
      case "info":
        svg = `
          <svg class="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>`;
        break;
    }

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  get colorClass() {
    return {
      success: "text-green-500 bg-green-500",
      error: "text-red-500 bg-red-500",
      warning: "text-yellow-500 bg-yellow-500",
      info: "text-blue-500 bg-blue-500",
    }[this.state];
  }
}


