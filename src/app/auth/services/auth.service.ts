import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "@env/environment";
import { Environment } from "@app/shared/types";
import { ForgotPasswordRequest, LogInRequest, RegisterRequest, ResetPasswordRequest } from "../types/auth.types";
import { Observable } from "rxjs";
import { APIResponse } from "@app/shared/types";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiUrl = (environment as Environment).apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * This method is used to log in a user.
   *
   * @param {LogInRequest} reqData
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof AuthService
   */
  logIn(reqData: LogInRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/log-in`, { ...reqData }, {
      withCredentials: true,
    });
  }

  /**
   * This method is used to sign up a user.
   *
   * @param {RegisterRequest} reqData
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof AuthService
   */
  signUp(reqData: RegisterRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/sign-up`, { ...reqData });
  }

  /**
   * This method is used to send a forgot password request.
   *
   * @param {ForgotPasswordRequest} email
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof AuthService
   */
  forgotPassword(email: ForgotPasswordRequest): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/forgot-password`, email);
  }

  /**
   * This method is used to log out a user.
   *
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof AuthService
   */
  logOut(): Observable<APIResponse<null>> {
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/log-out`, {},{
      withCredentials: true,
    });
  }

  /**
   * This method is used to reset the password of a user.
   *
   * @param {string} resetToken
   * @param {Omit<ResetPasswordRequest, 'resetToken'>} reqData
   * @return {*}  {Observable<APIResponse<null>>}
   * @memberof AuthService
   */
  resetPassword(resetToken: string, reqData: Omit<ResetPasswordRequest, 'resetToken'>): Observable<APIResponse<null>> {
    const body: ResetPasswordRequest = {
      resetToken,
      ...reqData
    };
  
    return this.http.post<APIResponse<null>>(`${this.apiUrl}/reset-password`, body);
  }
  
}
