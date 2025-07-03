import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, } from "@angular/router";
import { VideoService } from "@app/shared/service/video/video.service";
import { VideoCardComponent } from "../video-card/video-card.component";
import { ViewCountPipe } from "@app/shared/pipes/view-count/view-count.pipe";
import { DurationPipe } from "@app/shared/pipes/duration/duration.pipe";
import { TimeAgoPipe } from "@app/shared/pipes/time-ago/time-ago.pipe";
import { APIResponse } from "@app/shared/types";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";

@Component({
  selector: "app-main-video-content",
  imports: [VideoCardComponent, ViewCountPipe, DurationPipe, TimeAgoPipe],
  templateUrl: "./main-video-content.component.html",
  styleUrl: "./main-video-content.component.css",
})
export class MainVideoContentComponent implements OnInit, AfterViewInit {
  videoData: any;
    
  constructor(
    private videoService: VideoService,
    private route: ActivatedRoute,
    private appTitle:AppTitleService
  ) {}

  /**
   * This method is called when the component is initialized.
   *
   * @memberof MainVideoContentComponent
   */
  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get("uuid");
    this.videoService.getVideoByUUId(uuid!).subscribe({
      next: (response: any) => {
        const apiResponse = response as APIResponse<any>;
        this.videoData = apiResponse.data;
        this.appTitle.setTitle(this.videoData.title);
      },
      error: (err) => {
        console.error("Error fetching video:", err);
      },
    });
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
  
  @ViewChild('videoCardRef') videoCardComponent!: VideoCardComponent;

  viewCounted = false;
  private watchedSeconds = 0;
  private lastTime = 0;

  ngAfterViewInit() {
    const player = this.videoCardComponent.getVideoElement();
    const videoId = this.videoData.uuid;
    const duration = this.videoData.duration;
    const STORAGE_KEY = 'viewedVideos';
    const now = new Date();
    const nowISO = now.toISOString();

    let viewedVideos: {
      id: string;
      lastViewedAt: string;
      count: number;
      thresholds: number[];
    }[] = [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        viewedVideos = JSON.parse(stored);
      } catch {
        console.warn("Corrupt localStorage: Resetting...");
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const videoEntry = viewedVideos.find(v => v.id === videoId);

    const viewIndex = videoEntry ? viewedVideos.indexOf(videoEntry) : -1;

    // Check if in the last 1 hour
    const isWithinOneHour = (last: string) => {
      const lastTime = new Date(last).getTime();
      return now.getTime() - lastTime < 60 * 60 * 1000; // 1 hour
    };

    let currentCount = 0;
    let nextThresholdMultiplier = 1;

    if (videoEntry && isWithinOneHour(videoEntry.lastViewedAt)) {
      currentCount = videoEntry.count;
      nextThresholdMultiplier = 1 + (currentCount * 0.2); // 20% increment per view
      if (currentCount >= 5) {
        return;
      }
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
        };

        if (viewIndex >= 0) {
          viewedVideos[viewIndex] = updatedEntry;
        } else {
          viewedVideos.push(updatedEntry);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedVideos));
        player.removeEventListener('timeupdate', onTimeUpdate);

        // this.incrementViewCount(); // backend call
      }
    };

    player.addEventListener('timeupdate', onTimeUpdate);
  }
  

}
