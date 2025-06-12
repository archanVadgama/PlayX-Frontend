import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
export class MainVideoContentComponent implements OnInit {
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
        console.log(apiResponse);
        this.videoData = apiResponse.data;
        this.appTitle.setTitle(this.videoData.title);
      },
      error: (err) => {
        console.error("Error fetching video:", err);
      },
    });
  }
}
