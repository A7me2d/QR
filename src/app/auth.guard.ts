import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let _Route = inject(Router);
  if (localStorage.getItem('Mr Ahmed') !== null) {
    return true;
  }else{
    _Route.navigate(['/sigin']);
    return false;
  }
};
