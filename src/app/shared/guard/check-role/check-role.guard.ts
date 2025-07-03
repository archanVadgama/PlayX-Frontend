import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

export const checkRoleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const jwtHelper = new JwtHelperService;
  
  // Get access token from cookies
  const accessToken = cookieService.get('accessToken');
  
  // If no token exists, redirect to log-in
  if (!accessToken) {
    router.navigate(['/log-in']);
    return false;
  }
  
  try {
    // Verify the token and decode it
    if (jwtHelper.isTokenExpired(accessToken)) {
      router.navigate(['/log-in']);
      // Token is expired
      return false;
    }
    
    // Get the payload from the token
    const decodedToken = jwtHelper.decodeToken(accessToken);
    // Check if user is admin
    if (decodedToken && decodedToken.isAdmin === true) {
      return true; // Allow access to admin routes
    } else {
      // User is not an admin, redirect to unauthorized page or home
      router.navigate(['/unauthorized']);
      return false;
    }
  } catch (error) {
    // Error decoding the token
    console.error('Error verifying token:', error);
    router.navigate(['/log-in']);
    return false;
  }
  
};