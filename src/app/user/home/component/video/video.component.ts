import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-video',
  imports: [CommonModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css'
})
export class VideoComponent {
  hoveredIndex: number | null = null;

  onMouseEnter(index: number): void {
    this.hoveredIndex = index;
    const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (video) {
      video.play();
    }
  }

  onMouseLeave(index: number): void {
    this.hoveredIndex = null;
    const video = document.getElementById(`video-${index}`) as HTMLVideoElement;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }
  videos = [
    { title: "Epic Mountain Biking Adventure", channelName: "OutdoorVlogger", views:"1.2M", duration:"8:45", publishedAt:"6 hours ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "JavaScript Crash Course 2025", channelName: "CodeMaster", views:"342K", duration:"15:18", publishedAt:"2 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Homemade Pizza Recipe", channelName: "CookingWithJoy", views:"876K", duration:"12:36", publishedAt:"3 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Ambient Music for Studying", channelName: "ChillBeats", views:"2.8M", duration:"1:05:22", publishedAt:"5 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "DIY Home Office Setup", channelName: "InteriorDesignPro", views:"456K", duration:"7:12", publishedAt:"2 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Morning Yoga Routine", channelName: "YogaWithSarah", views:"3.1M", duration:"22:45", publishedAt:"1 year ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Top 10 Anime of 2024", channelName: "AnimeFanatic", views:"981K", duration:"16:39", publishedAt:"1 month ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "NYC Travel Guide 2025", channelName: "TravelWithMe", views:"1.5M", duration:"28:10", publishedAt:"4 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Building a Gaming PC", channelName: "TechGenius", views:"4.2M", duration:"19:55", publishedAt:"7 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Acoustic Guitar Cover - Hey Jude", channelName: "MusicLover99", views:"756K", duration:"4:18", publishedAt:"9 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Photography Tips for Beginners", channelName: "PhotoMaster", views:"289K", duration:"11:42", publishedAt:"3 weeks ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "React vs Angular in 2025", channelName: "WebDevSimplified", views:"1.1M", duration:"14:25", publishedAt:"2 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Hidden Gems in Paris", channelName: "EuropeTraveler", views:"687K", duration:"25:30", publishedAt:"6 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Japanese Street Food Tour", channelName: "FoodiesDelight", views:"5.6M", duration:"32:17", publishedAt:"8 days ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
    { title: "Beginner's Guide to Chess", channelName: "ChessMaster", views:"421K", duration:"17:50", publishedAt:"5 months ago", thumbnail:"https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png", profileImg:"https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740", src: "https://www.w3schools.com/html/movie.mp4" },
  ];
}
