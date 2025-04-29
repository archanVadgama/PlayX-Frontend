import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Video {
  id: number;
  title: string;
  channelName: string;
  views: string;
  duration: string;
  publishedAt: string;
  thumbnail: string;
  profileImg: string;
  src: string;
}

@Component({
  selector: 'app-video',
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent implements OnInit, OnDestroy{
  hoveredIndex = signal<number | null>(null);
  menuOpenId = signal<number | null>(null);

  onMouseEnter(id: number): void {
    this.hoveredIndex.set(id);
    const video = document.getElementById(`video-${id}`) as HTMLVideoElement;
    if (video) {
      video.play().catch(error => console.log('Autoplay prevented:', error));
    }
  }

  onMouseLeave(id: number): void {
    this.hoveredIndex.set(null);
    const video = document.getElementById(`video-${id}`) as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  toggleMenu(id: number, event: Event): void {
    // Make sure the event doesn't propagate to the container div
    event.stopPropagation();
    event.preventDefault();
    
    // Toggle the menu
    if (this.menuOpenId() === id) {
      this.menuOpenId.set(null);
    } else {
      this.menuOpenId.set(id);
    }
    
    // Logging to help with debugging
    console.log('Menu toggled for video ID:', id, 'Menu is now:', this.menuOpenId() === id ? 'open' : 'closed');
  }

  closeAllMenus(): void {
    // Close all menus when clicking outside
    if (this.menuOpenId() !== null) {
      console.log('Closing all menus');
      this.menuOpenId.set(null);
    }
  }

  handleMenuAction(action: string, videoId: number, event: Event): void {
    event.stopPropagation();
    
    switch(action) {
      case 'report':
        console.log(`Reporting video ${videoId}`);
        break;
      case 'share':
        console.log(`Sharing video ${videoId}`);
        break;
    }
    
    this.menuOpenId.set(null);
  }

  videos: Video[]  = [
    { id: 1, title: "Epic Mountain Biking Adventure", channelName: "OutdoorVlogger", views:"1.2M", duration:"8:45", publishedAt:"6 hours ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 2, title: "JavaScript Crash Course 2025", channelName: "CodeMaster", views:"342K", duration:"15:18", publishedAt:"2 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 3, title: "Homemade Pizza Recipe", channelName: "CookingWithJoy", views:"876K", duration:"12:36", publishedAt:"3 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 4, title: "Ambient Music for Studying", channelName: "ChillBeats", views:"2.8M", duration:"1:05:22", publishedAt:"5 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 5, title: "DIY Home Office Setup", channelName: "InteriorDesignPro", views:"456K", duration:"7:12", publishedAt:"2 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 6, title: "Morning Yoga Routine", channelName: "YogaWithSarah", views:"3.1M", duration:"22:45", publishedAt:"1 year ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 7, title: "Top 10 Anime of 2024", channelName: "AnimeFanatic", views:"981K", duration:"16:39", publishedAt:"1 month ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 8, title: "NYC Travel Guide 2025", channelName: "TravelWithMe", views:"1.5M", duration:"28:10", publishedAt:"4 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 9, title: "Building a Gaming PC", channelName: "TechGenius", views:"4.2M", duration:"19:55", publishedAt:"7 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 10, title: "Acoustic Guitar Cover - Hey Jude", channelName: "MusicLover99", views:"756K", duration:"4:18", publishedAt:"9 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 11, title: "Photography Tips for Beginners", channelName: "PhotoMaster", views:"289K", duration:"11:42", publishedAt:"3 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 12, title: "React vs Angular in 2025", channelName: "WebDevSimplified", views:"1.1M", duration:"14:25", publishedAt:"2 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 13, title: "Hidden Gems in Paris", channelName: "EuropeTraveler", views:"687K", duration:"25:30", publishedAt:"6 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 14, title: "Japanese Street Food Tour", channelName: "FoodiesDelight", views:"5.6M", duration:"32:17", publishedAt:"8 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 15, title: "Beginner's Guide to Chess", channelName: "ChessMaster", views:"421K", duration:"17:50", publishedAt:"5 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 16, title: "Epic Mountain Biking Adventure", channelName: "OutdoorVlogger", views:"1.2M", duration:"8:45", publishedAt:"6 hours ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 17, title: "JavaScript Crash Course 2025", channelName: "CodeMaster", views:"342K", duration:"15:18", publishedAt:"2 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 18, title: "Homemade Pizza Recipe", channelName: "CookingWithJoy", views:"876K", duration:"12:36", publishedAt:"3 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 19, title: "Ambient Music for Studying", channelName: "ChillBeats", views:"2.8M", duration:"1:05:22", publishedAt:"5 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 20, title: "DIY Home Office Setup", channelName: "InteriorDesignPro", views:"456K", duration:"7:12", publishedAt:"2 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 21, title: "Morning Yoga Routine", channelName: "YogaWithSarah", views:"3.1M", duration:"22:45", publishedAt:"1 year ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 22, title: "Top 10 Anime of 2024", channelName: "AnimeFanatic", views:"981K", duration:"16:39", publishedAt:"1 month ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 23, title: "NYC Travel Guide 2025", channelName: "TravelWithMe", views:"1.5M", duration:"28:10", publishedAt:"4 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 24, title: "Building a Gaming PC", channelName: "TechGenius", views:"4.2M", duration:"19:55", publishedAt:"7 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 25, title: "Acoustic Guitar Cover - Hey Jude", channelName: "MusicLover99", views:"756K", duration:"4:18", publishedAt:"9 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 26, title: "Photography Tips for Beginners", channelName: "PhotoMaster", views:"289K", duration:"11:42", publishedAt:"3 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 27, title: "React vs Angular in 2025", channelName: "WebDevSimplified", views:"1.1M", duration:"14:25", publishedAt:"2 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 28, title: "Hidden Gems in Paris", channelName: "EuropeTraveler", views:"687K", duration:"25:30", publishedAt:"6 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 29, title: "Japanese Street Food Tour", channelName: "FoodiesDelight", views:"5.6M", duration:"32:17", publishedAt:"8 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { id: 30, title: "Beginner's Guide to Chess", channelName: "ChessMaster", views:"421K", duration:"17:50", publishedAt:"5 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
  ];

  videosToShow: Video[] = [];
  itemsPerLoad = 15; // First load will be 15
  currentIndex = 0;
  isLoading = false;
  scrollHandler: any;
  showPlaceholder = true; // Flag to control placeholder visibility
  isFirstLoad = true; // Flag to track the first load
  placeholderArray = [
    {id:1},
    {id:2},
    {id:3},
    {id:4},
    {id:5},
    {id:6},
    {id:7},
    {id:8},
    {id:9},
    {id:10},
    {id:11},
    {id:12},
    {id:13},
    {id:14},
    {id:15},
  ]; // Placeholder array for 15 items

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadMoreVideos();

      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.scrollHandler);
    }
  }

  loadMoreVideos() {
    if (this.isLoading) return;

    this.isLoading = true;
    
    const nextItemsToLoad = this.isFirstLoad ? this.itemsPerLoad : 10; // Load 15 on first load, 10 on subsequent scrolls
    const nextVideos = this.videos.slice(this.currentIndex, this.currentIndex + nextItemsToLoad);
    this.videosToShow.push(...nextVideos);
    this.currentIndex += nextItemsToLoad;

    // After first load, set the flag to load 10 items on scroll
    if (this.isFirstLoad) {
      this.isFirstLoad = false;
    }

    this.isLoading = false;
  }

  onScroll() {
    const bottomReached = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100);
    if (bottomReached) {
      this.loadMoreVideos();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

}
