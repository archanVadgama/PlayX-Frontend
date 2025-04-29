import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { Environment } from "@app/shared/types";
import { ForgotPasswordRequest, LogInRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth.types";
import { Observable } from "rxjs";
import { APIResponse } from "@app/shared/types";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  logIn(reqData: LogInRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/log-in`, { ...reqData }, {
      withCredentials: true,
    });
  }

  signUp(reqData: RegisterRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/sign-up`, { ...reqData });
  }

  forgotPassword(email: ForgotPasswordRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/forgot-password`, email);
  }

  logOut(): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/log-out`, {},{
      withCredentials: true,
    });
  }

  resetPassword(resetToken: string, reqData: Omit<ResetPasswordRequest, 'resetToken'>): Observable<APIResponse<null>> {
    const body: ResetPasswordRequest = {
      resetToken,
      ...reqData
    };
  
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/reset-password`, body);
  }
  
}
