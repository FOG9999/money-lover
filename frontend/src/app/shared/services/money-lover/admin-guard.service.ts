import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../storage.service';
import { CONSTS } from '../../../consts';

@Injectable({providedIn: 'root'})
export class AdminAuthGuardService implements CanActivate {
    constructor(
        private localStorage: LocalStorageService,
        private router: Router
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if(this.localStorage.get("user") && this.localStorage.get("user").token){
            let level = this.localStorage.get("user").level;
            if(level == CONSTS.auth.ADMIN || level == CONSTS.auth.SYSTEM){
                return true;
            }
            else {
                const url: UrlTree = this.router.parseUrl("/auth/login");
                return url;
            }
        }
        else {
            const url: UrlTree = this.router.parseUrl("/auth/login");
            return url;
        };
    }
    
}