import { AfterViewChecked, AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, } from "@angular/router";
import { VideoService } from "@app/shared/service/video/video.service";
import { VideoCardComponent } from "../video-card/video-card.component";
import { ViewCountPipe } from "@app/shared/pipes/view-count/view-count.pipe";
import { DurationPipe } from "@app/shared/pipes/duration/duration.pipe";
import { TimeAgoPipe } from "@app/shared/pipes/time-ago/time-ago.pipe";
import { APIResponse } from "@app/shared/types";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";
import { viewedVideosI } from "../../types/video.types";
import { isPlatformBrowser } from "@angular/common";
import { AgeRestrictedComponent } from "../age-restricted/age-restricted.component";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "app-main-video-content",
  imports: [VideoCardComponent, ViewCountPipe, AgeRestrictedComponent, DurationPipe, TimeAgoPipe],
  templateUrl: "./main-video-content.component.html",
  styleUrl: "./main-video-content.component.css",
})
export class MainVideoContentComponent implements OnInit, AfterViewChecked {
  videoData: any;
  resumeFromTime: number = 0;
  isAgeConfirmed = false;
  userId: number = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private router: Router,
    private appTitle: AppTitleService,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) { }

  /**
   * This method is called when the component is initialized.
   *
   * @memberof MainVideoContentComponent
   */
  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get("uuid");
    this.videoService.getVideoByUUId(uuid!).subscribe({
      next: (response: any) => {
        this.videoData = response.data;
        this.appTitle.setTitle(this.videoData.title);
    
        const videoId = this.videoData.id; 
        const STORAGE_KEY = 'viewedVideos';
    
        if (isPlatformBrowser(this.platformId)) {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const viewedVideos: any[] = JSON.parse(stored);
              const entry = viewedVideos.find(v => v.id === videoId); // 👈 Match by numeric ID
              if (entry?.lastTimestamp && !isNaN(entry.lastTimestamp)) {
                this.resumeFromTime = entry.lastTimestamp;
              }
            } catch {
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        }
    
        if (!this.videoData.isAgeRestricted) {
          this.isAgeConfirmed = true;
        }
      },
      error: (err) => {
        console.error("Error fetching video:", err);
      },
    });
  }

  handleAgeConfirmed() {
    this.isAgeConfirmed = true;
  }

  handleAgeCancelled() {
    this.router.navigate(['/']); // or show a toast/notification
  }

  /**
   * Calculates the view threshold based on video duration.
   *
   * @param {number} duration
   * @param {number} [multiplier=1]
   * @return {*}  {number}
   * @memberof MainVideoContentComponent
   */
  getViewThreshold(duration: number, multiplier: number = 1): number {
    if (duration <= 30) return duration * 0.7 * multiplier;
    if (duration <= 300) return 30 * multiplier;
    if (duration <= 1800) return duration * 0.12 * multiplier;
    return 240 * multiplier;
  }

  /**
   * Increments the view count of the video.
   *
   * @param {string} uuid
   * @memberof MainVideoContentComponent
   */
  incrementViewCount(uuid: string) {
    this.videoService.incrementViewCount(uuid).subscribe({
      next: (response: any) => {
        const apiResponse = response as APIResponse<any>;
        if (apiResponse.status) {

          // Update view count in UI
          if (this.videoData.viewCount != null) {
            this.videoData.viewCount += 1;
          } else {
            this.videoData.viewCount = 1;
          }
        } else {
          console.error("Failed to update view count:", apiResponse.message);
        }
      },
      error: (err) => {
        console.error("Error updating view count:", err);
      },
    });
  }

  private updateWatchHistory(videoId: number,
    lastTimeStamp: number): void {
    const accessToken = this.cookieService.get('accessToken');

    if (!accessToken) {
      console.log('No access token found', accessToken);
      this.router.navigate(['/log-in']);
    }

    try {
      // Verify the token and decode it
      if (this.jwtHelper.isTokenExpired(accessToken)) {
        this.router.navigate(['/log-in']);
      }

      // Get the payload from the token
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      this.userId = Number(atob(decodedToken.id))

    } catch (error) {
      // Error decoding the token
      console.error('Error verifying token:', error);
      this.router.navigate(['/']);
    }
    const data = {
      videoId,
      userId: this.userId,
      lastTimeStamp
    }
    this.videoService.setWatchHistory(data).subscribe({
      next: (res) => {
        console.log("Watch history updated ✅", res);
      },
      error: (err) => {
        console.error("Failed to update watch history ❌", err);
      }
    });
  }


  @ViewChild('videoCardRef') videoCardComponent!: VideoCardComponent;

  viewCounted = false;
  private watchedSeconds = 0;
  private lastTime = 0;
  private initialized = false;

  ngAfterViewChecked() {
    if (!this.initialized && this.videoCardComponent) {
      this.initialized = true;
      this.setupVideoTracking();
    }
  }
  
  setupVideoTracking() {
    const player = this.videoCardComponent.getVideoElement();
    const videoId = this.videoData.id;
    const duration = this.videoData.duration;
    const STORAGE_KEY = 'viewedVideos';
    const now = new Date();
    const nowISO = now.toISOString();

    let viewedVideos: viewedVideosI[] = [];

    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          viewedVideos = JSON.parse(stored);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }

    const videoEntry = viewedVideos.find(v => v.id === videoId);
    const viewIndex = videoEntry ? viewedVideos.indexOf(videoEntry) : -1;

    // Resume from last timestamp if available
    if (this.resumeFromTime && !isNaN(this.resumeFromTime)) {
      player.currentTime = this.resumeFromTime;
    }

    const isWithinOneHour = (last: string) => {
      const lastTime = new Date(last).getTime();
      return now.getTime() - lastTime < 60 * 60 * 1000; // 1 hour
    };

    let currentCount = 0;
    let nextThresholdMultiplier = 1;

    if (videoEntry && isWithinOneHour(videoEntry.lastViewedAt)) {
      currentCount = videoEntry.count;
      nextThresholdMultiplier = 1 + (currentCount * 0.2);
      if (currentCount >= 5) return;
    }

    const requiredWatchTime = this.getViewThreshold(duration, nextThresholdMultiplier);

    const onTimeUpdate = () => {
      const currentTime = player.currentTime;
      const delta = currentTime - this.lastTime;

      if (delta > 0 && delta < 1.5) {
        this.watchedSeconds += delta;
      }

      this.lastTime = currentTime;

      if (!this.viewCounted && this.watchedSeconds >= requiredWatchTime) {
        this.viewCounted = true;

        const updatedEntry = {
          id: videoId,
          lastViewedAt: nowISO,
          count: currentCount + 1,
          thresholds: videoEntry?.thresholds
            ? [...videoEntry.thresholds, requiredWatchTime]
            : [requiredWatchTime],
          lastTimestamp: currentTime, // save last watched position on view count
        };

        if (viewIndex >= 0) {
          viewedVideos[viewIndex] = updatedEntry;
        } else {
          viewedVideos.push(updatedEntry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedVideos));
        player.removeEventListener('timeupdate', onTimeUpdate);

        this.incrementViewCount(videoId); // Backend API call
        this.updateWatchHistory(videoId, currentTime);

      }
    };

    const saveCurrentTime = () => {
      const currentTime = player.currentTime;
      const freshStored = localStorage.getItem(STORAGE_KEY);
      let updatedVideos: viewedVideosI[] = [];
console.log("Test");
      this.updateWatchHistory(videoId, currentTime);
      if (freshStored) {
        try {
          updatedVideos = JSON.parse(freshStored);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      const idx = updatedVideos.findIndex(v => v.id === videoId);
      if (idx !== -1) {
        updatedVideos[idx].lastTimestamp = currentTime;
      } else {
        updatedVideos.push({
          id: videoId,
          lastViewedAt: '',
          count: 0,
          thresholds: [],
          lastTimestamp: currentTime
        });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVideos));
    };


    // Save timestamp when paused
    player.addEventListener('pause', saveCurrentTime);

    // Save timestamp when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        saveCurrentTime();
      }
    });

    player.addEventListener('timeupdate', onTimeUpdate);
  }


}
