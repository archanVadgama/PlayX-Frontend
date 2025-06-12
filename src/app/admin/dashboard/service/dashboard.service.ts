import { Injectable } from "@angular/core";
import { APIResponse, Environment } from "@app/shared/types";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardStatics() {
    return this.http.get(`${this.apiUrl}/dashboard`, {
      withCredentials: true,
    });
  }
}
