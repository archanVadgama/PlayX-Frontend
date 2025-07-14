import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIResponse, Environment, Video } from "@app/shared/types";
import { environment } from "@env/environment";
import { Observable } from "rxjs";

export interface WatchHistory {
  videoId: number, 
  userId: number, 
  lastTimeStamp: number
}

@Injectable({
  providedIn: "root",
})
export class VideoService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * This method is used to fetch the feed videos.
   *
   * @return {*}  {Observable<APIResponse<Video[]>>}
   * @memberof VideoService
   */
  feedVideos(): Observable<APIResponse<Video[]>> {
    return this.http.get<APIResponse<Video[]>>(`${this.apiUrl}/feed`, {
      withCredentials: true,
    });
  }

  /**
   * This method is used to fetch the specific video.
   *
   * @param {string} uuid
   * @return {*} 
   * @memberof VideoService
   */
  getVideoByUUId(uuid: string) {
    return this.http.get(`${this.apiUrl}/watch/${uuid}`, {
      withCredentials: true,
    });
  }

  getMyVideos(userId: number) {
    return this.http.get(`${this.apiUrl}/my-videos/${userId}`, {
      withCredentials: true,
    });
  }

  getWatchHistory(uuid: string) {
    return this.http.get(`${this.apiUrl}/watch-history/${uuid}`, {
      withCredentials: true,
    });
  }

  setWatchHistory(data: WatchHistory) {
    console.log(data);
    return this.http.post(`${this.apiUrl}/watch-history`, data,
      {
        withCredentials: true,
      });
  }
  
  incrementViewCount(uuid: string) {
    return this.http.post(`${this.apiUrl}/view-count/${uuid}`, {}, {
      withCredentials: true
    });
  }
}
