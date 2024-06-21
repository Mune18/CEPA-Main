import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(private dataService: DataService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLoggedIn = this.dataService.isLoggedIn();
    const role = this.dataService.getRole();

    if (state.url.startsWith('/user/login') && isLoggedIn && role === 'Student') {
      return this.router.parseUrl('/user/home');
    }

    if (isLoggedIn && role === 'Student') {
      return true;
    }

    if (!state.url.startsWith('/user/login')) {
      return this.router.parseUrl('/user/login');
    }

    return true;
  }
}
