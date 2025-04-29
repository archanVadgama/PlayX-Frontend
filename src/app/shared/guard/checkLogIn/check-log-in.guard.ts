import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '@app/shared/service/toast/toast.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';

export const checkLogInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const jwtHelper = new JwtHelperService;
  const toast = inject(ToastService);

  // Get access token from cookies
  const accessToken = cookieService.get('accessToken');
    
  // If no token exists, redirect to log-in
  if (!accessToken) {
    toast.show("info","Please log in.");
    router.navigate(['/log-in']);
    return false;
  }

  try {
    // Verify the token and decode it
    if (jwtHelper.isTokenExpired(accessToken)) {
      toast.show("info","Your session has expired. Please log in again.");
      router.navigate(['/log-in']);
      // Token is expired
      return false;
    }
    return true;
    
  } catch (error) {
    // Error decoding the token
    console.error('Error verifying token:', error);
    router.navigate(['/log-in']);
    return false;
  }
};
