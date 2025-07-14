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
import { VideoService } from "@app/shared/service/video/video.service";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";

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
  componentTitle: string = "";

  placeholderArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private video: VideoService,
    private appTitle: AppTitleService,
    private search: SearchService,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {}

  /**
   * This method is called when the component is initialized.
   *
   * @memberof SearchResultsComponent
   */
  ngOnInit(): void {
    const currentUrl = this.router.url;
    console.log(currentUrl);
  
    switch (true) {
      case currentUrl.includes("my-videos"):
        this.componentTitle = "My Videos";
        this.appTitle.setTitle(this.componentTitle);
        this.fetchMyVideos();
        break;
  
      case currentUrl.includes("watch-history"):
        this.componentTitle = "Watch History";
        this.appTitle.setTitle(this.componentTitle);
  
        if (isPlatformBrowser(this.platformId)) {
          this.fetchWatchHistory();
  
          this.scrollHandler = this.onScroll.bind(this);
          window.addEventListener("scroll", this.scrollHandler);
        }
        break;
  
      default:
        this.componentTitle = "Search Results";
        this.appTitle.setTitle(this.componentTitle);
  
        this.route.queryParams.subscribe((params) => {
          const searchQuery = params["search_query"] || "";
          const sortBy = params["sort_by"] || "";
          const duration = params["duration"] || "";
          const uploadDate = params["upload_date"] || "";
  
          if (searchQuery.trim() === "") {
            this.videos = [];
            return;
          }
  
          this.search.searchResult(searchQuery, sortBy, duration, uploadDate).subscribe({
            next: (res) => {
              const response = res as APIResponse<any[]>;
              this.videos = response.data;
              this.loadMoreVideos();
            },
            error: () => {
              this.videos = [];
            },
          });
        });
        break;
    }
  }
  

  fetchMyVideos(): void {
    const accessToken = this.cookieService.get("accessToken");

    if (!accessToken) {
      console.log("No access token found", accessToken);
      this.router.navigate(["/log-in"]);
    }

    try {
      // Verify the token and decode it
      if (this.jwtHelper.isTokenExpired(accessToken)) {
        this.router.navigate(["/log-in"]);
      }

      // Get the payload from the token
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      const userId = Number(atob(decodedToken.id));
      console.log("User ID:", userId);
      this.video.getMyVideos(userId).subscribe({
        next: (res) => {
          const response = res as APIResponse<any[]>;
          this.videos = response.data;

          // Load the first batch of videos after fetching
          this.loadMoreVideos();
        },
        error: () => {
          this.videos = [];
        },
      });
    } catch (error) {
      // Error decoding the token
      console.error("Error verifying token:", error);
      this.router.navigate(["/"]);
    }
  }

  fetchWatchHistory(): void {
    const accessToken = this.cookieService.get("accessToken");

    if (!accessToken) {
      console.log("No access token found", accessToken);
      this.router.navigate(["/log-in"]);
    }

    try {
      // Verify the token and decode it
      if (this.jwtHelper.isTokenExpired(accessToken)) {
        this.router.navigate(["/log-in"]);
      }

      // Get the payload from the token
      const decodedToken = this.jwtHelper.decodeToken(accessToken);
      const userId = atob(decodedToken.id);

      this.video.getWatchHistory(userId).subscribe({
        next: (res) => {
          const response = res as APIResponse<any[]>;
          this.videos = response.data;

          // Load the first batch of videos after fetching
          this.loadMoreVideos();
        },
        error: () => {
          this.videos = [];
        },
      });
    } catch (error) {
      // Error decoding the token
      console.error("Error verifying token:", error);
      this.router.navigate(["/"]);
    }
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

    const nextItemsToLoad = this.isFirstLoad ? this.itemsPerLoad : 10;
    const nextVideos = this.videos.slice(
      this.currentIndex,
      this.currentIndex + nextItemsToLoad
    );
    this.videosToShow.push(...nextVideos);
    this.currentIndex += nextItemsToLoad;

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
