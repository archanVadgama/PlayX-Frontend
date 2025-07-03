import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { VideoService } from "@app/shared/service/video/video.service";
import { APIResponse, Video } from "@app/shared/types";
import { ViewCountPipe } from "@app/shared/pipes/view-count/view-count.pipe";
import { DurationPipe } from "@app/shared/pipes/duration/duration.pipe";
import { TimeAgoPipe } from "@app/shared/pipes/time-ago/time-ago.pipe";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";

@Component({
  selector: "app-video",
  imports: [CommonModule, ViewCountPipe, DurationPipe, TimeAgoPipe],
  templateUrl: "./video.component.html",
  styleUrl: "./video.component.css",
})
export class VideoComponent implements OnInit, OnDestroy {
  hoveredIndex = signal<string | null>(null);
  menuOpenId = signal<string | null>(null);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private video: VideoService,
    private appTitle: AppTitleService
    
  ) {}

  /**
   * Handles mouse enter event on a video card.
   *
   * @param {string} uuid
   * @memberof VideoComponent
   */
  onMouseEnter(uuid: string): void {
    this.hoveredIndex.set(uuid);
    const video = document.getElementById(`video-${uuid}`) as HTMLVideoElement;
    if (video) {
      video.play().catch((error) => console.log("Autoplay prevented:", error));
    }
  }

  /**
   * Handles mouse leave event on a video card.
   *
   * @param {string} uuid
   * @memberof VideoComponent
   */
  onMouseLeave(uuid: string): void {
    this.hoveredIndex.set(null);
    const video = document.getElementById(`video-${uuid}`) as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  /**
   * Toggles the menu for a specific video card.
   *
   * @param {string} uuid
   * @param {Event} event
   * @memberof VideoComponent
   */
  toggleMenu(uuid: string, event: Event): void {
    // Make sure the event doesn't propagate to the container div
    event.stopPropagation();
    event.preventDefault();

    // Toggle the menu
    if (this.menuOpenId() === uuid) {
      this.menuOpenId.set(null);
    } else {
      this.menuOpenId.set(uuid);
    }

    // Logging to help with debugging
    console.log(
      "Menu toggled for video ID:",
      uuid,
      "Menu is now:",
      this.menuOpenId() === uuid ? "open" : "closed"
    );
  }

  /**
   * Closes all open menus when clicking outside of them.
   *
   * @memberof VideoComponent
   */
  closeAllMenus(): void {
    // Close all menus when clicking outside
    if (this.menuOpenId() !== null) {
      console.log("Closing all menus");
      this.menuOpenId.set(null);
    }
  }

  /**
   * Handles actions from the video card menu.
   *
   * @param {string} action
   * @param {number} videoId
   * @param {Event} event
   * @memberof VideoComponent
   */
  handleMenuAction(action: string, videoId: number, event: Event): void {
    event.stopPropagation();

    switch (action) {
      case "report":
        console.log(`Reporting video ${videoId}`);
        break;
      case "share":
        console.log(`Sharing video ${videoId}`);
        break;
    }

    this.menuOpenId.set(null);
  }

  videos: Video[] = [];
  videosToShow: Video[] = [];
  itemsPerLoad = 15; // First load will be 15
  currentIndex = 0;
  isLoading = false;
  scrollHandler: any;
  showPlaceholder = true; // Flag to control placeholder visibility
  isFirstLoad = true; // Flag to track the first load
 
  placeholderArray = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
    { id: 11 },
    { id: 12 },
    { id: 13 },
    { id: 14 },
    { id: 15 },
  ]; // Placeholder array for 15 items

  /**
   * Initializes the VideoComponent, sets the page title, and loads videos.
   *
   * @memberof VideoComponent
   */
  ngOnInit() {
    this.appTitle.setTitle('Dashboard');

    if (isPlatformBrowser(this.platformId)) {
      this.loadMoreVideos();

      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener("scroll", this.scrollHandler);
    }

    this.video.feedVideos().subscribe((res) => {
      const response = res as APIResponse<Video[]>;
      if (response.status) {
        this.videos = response.data;
        this.videosToShow = this.videos.slice(0, this.itemsPerLoad);
        this.currentIndex = this.itemsPerLoad;
        this.showPlaceholder = false; // Hide placeholder after data is loaded
      } else {
        console.error("Error fetching videos:", response.message);
      }
    });
  }

  /**
   * Loads more videos when the user scrolls to the bottom of the page.
   *
   * @return {*} 
   * @memberof VideoComponent
   */
  loadMoreVideos() {
    if (this.isLoading) return;

    this.isLoading = true;

    const nextItemsToLoad = this.isFirstLoad ? this.itemsPerLoad : 10; // Load 15 on first load, 10 on subsequent scrolls
    const nextVideos = this.videos.slice(
      this.currentIndex,
      this.currentIndex + nextItemsToLoad
    );
    this.videosToShow.push(...nextVideos);
    this.currentIndex += nextItemsToLoad;

    // After first load, set the flag to load 10 items on scroll
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
    }

    this.isLoading = false;
  }

  onScroll() {
    const bottomReached =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (bottomReached) {
      this.loadMoreVideos();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener("scroll", this.scrollHandler);
    }
  }

  onCardClick(uuid: string): void {
    this.router.navigate(["/watch", uuid]);
  }
}
