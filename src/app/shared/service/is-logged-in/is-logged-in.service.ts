import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {

  constructor(private cookieService: CookieService) {}

  isLoggedIn(): boolean {
    const token = this.cookieService.get('accessToken');
    if (!token) return false;
    
    // Check if the token is expired
    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }
}
