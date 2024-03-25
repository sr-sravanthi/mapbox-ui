import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  if (sessionStorage.getItem("userDetails") != null) {
    return true;
  }
  router.navigate(['/profile/login'], { queryParams: { returnUrl: state.url } })
  return false;
};
