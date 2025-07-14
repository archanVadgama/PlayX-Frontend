import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Environment } from "@app/shared/types";
import { environment } from "@env/environment";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * This method is used to search for videos based on the search query and optional filters.
   *
   * @param {string} searchQuery
   * @param {string} [sortBy]
   * @param {string} [duration]
   * @param {string} [uploadDate]
   * @return {*}
   * @memberof SearchService
   */
  searchResult(
    searchQuery: string,
    sortBy?: string,
    duration?: string,
    uploadDate?: string
  ) {
    const params: any = { search_query: searchQuery };
    if (sortBy) params.sort_by = sortBy;
    if (duration) params.duration = duration;
    if (uploadDate) params.upload_date = uploadDate;

    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
