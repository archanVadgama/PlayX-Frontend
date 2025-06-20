import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIResponse, Environment } from "@app/shared/types";
import { environment } from "@env/environment";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { UploadRequest } from "../types/upload.types";

@Injectable({
  providedIn: "root",
})
export class UploadService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private jwtHelper: JwtHelperService
  ) {}

  /**
   * This method retrieves the user ID from the JWT token stored in cookies.
   *
   * @return {*}  {number}
   * @memberof UploadService
   */
  getUserId(): number {
    const accessToken = this.cookieService.get("accessToken");
    if (!accessToken) {
      return 0;
    }
    const decodedToken = this.jwtHelper.decodeToken(accessToken);
    return parseInt(atob(decodedToken.id));
  }

  /**
   * This method uploads a video to the server.
   *
   * @param {UploadRequest} data
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof UploadService
   */
  uploadVideo(data: UploadRequest): Observable<APIResponse<null>> {

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("keywords", data.keywords);
    formData.append("categoryId", data.categoryId.toString());
    formData.append("isAgeRestricted", data.isAgeRestricted.toString());
    formData.append("isPrivate", data.isPrivate.toString());
    formData.append("userId", this.getUserId().toString());

    // Only append files if they exist
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }
    if (data.video) {
      formData.append("video", data.video);
    }

    return this.http.post<APIResponse<null>>(
      `${this.apiUrl}/upload-video`,
      formData,
      {
        withCredentials: true,
      }
    );
  }
}
