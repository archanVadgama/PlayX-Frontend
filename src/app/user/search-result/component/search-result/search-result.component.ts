// search-result.component.ts
import {
  Component,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { AppTitleService } from "@app/shared/service/app-title/app-title.service";
import { SearchService } from "../../service/search.service";
import { APIResponse, Video } from "@app/shared/types";
import { ViewCountPipe } from "@app/shared/pipes/view-count/view-count.pipe";
import { TimeAgoPipe } from "@app/shared/pipes/time-ago/time-ago.pipe";
import { ActivatedRoute, Router } from "@angular/router";
import { DurationPipe } from "@app/shared/pipes/duration/duration.pipe";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-search-result",
  imports: [ViewCountPipe, TimeAgoPipe, DurationPipe],
  templateUrl: "./search-result.component.html",
  styleUrl: "./search-result.component.css",
})
export class SearchResultsComponent implements OnInit {
  fallback =
    "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  hoveredIndex = signal<string | null>(null);
  menuOpenId = signal<string | null>(null);
  videos: Video[] = [];
  videosToShow: Video[] = [];
  itemsPerLoad = 3; // First load will be 3
  currentIndex = 0;
  isLoading = false;
  scrollHandler: any;
  showPlaceholder = true; // Flag to control placeholder visibility
  isFirstLoad = true; // Flag to track the first load

  placeholderArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private appTitle: AppTitleService,
    private search: SearchService
  ) {}

  /**
   * This method is called when the component is initialized.
   *
   * @memberof SearchResultsComponent
   */
  ngOnInit(): void {
    this.appTitle.setTitle("Search Results");
    if (isPlatformBrowser(this.platformId)) {
      this.loadMoreVideos();

      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener("scroll", this.scrollHandler);
    }

    // Subscribe to query parameters to get search results
    this.route.queryParams.subscribe((params) => {
      const searchQuery = params["search_query"] || "";
      const sortBy = params["sort_by"] || "";
      const duration = params["duration"] || "";
      const uploadDate = params["upload_date"] || "";

      // Perform the search with the provided parameters
      if (searchQuery.trim() === "") {
        this.videos = []; // Clear videos if search query is empty
        return;
      }
      this.search
        .serachResult(searchQuery, sortBy, duration, uploadDate)
        .subscribe({
          next: (res) => {
            const response = res as APIResponse<Video[]>;
            this.videos = response.data;
          },
          error: (error) => {
            this.videos = []; // Optional: clear existing videos
          },
        });
    });
  }

  /**
   * Handles mouse enter event on a video card.
   *
   * @param {string} uuid
   * @memberof SearchResultsComponent
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
   * This method is used to load more videos when the user scrolls down.
   *
   * @return {*}
   * @memberof SearchResultsComponent
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

  closeAllMenus(): void {
    // Close all menus when clicking outside
    if (this.menuOpenId() !== null) {
      console.log("Closing all menus");
      this.menuOpenId.set(null);
    }
  }
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
}
