import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { VideoService } from '@app/shared/service/video/video.service';

@Component({
  selector: 'app-video-card',
  imports: [],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css'
})
export class VideoCardComponent {
  @Input() videoUrl: string = '';
  @Input() title: string = '';
  @Input() duration: string = '';
  @Input() channelName: string = '';
  @Input() views: string = '';
  @Input() createdAt: string = '';
  @Input() profileImage: string = '';
  @Input() uuid: string = '';

  menuOpen: boolean = false;

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  public getVideoElement(): HTMLVideoElement {
    return this.videoEl.nativeElement;
  }
  

}
