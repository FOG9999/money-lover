import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { mergeMap, Observable, of, throwError } from 'rxjs';
import { LocalStorageService } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { CONSTS } from 'app/consts';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private localStorage: LocalStorageService, private toastService: ToastrService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('login') || req.url.includes('register')) {
            return next.handle(req);
        }
        let authReq = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + this.localStorage.get("user").token)
        });        
        return next.handle(authReq).pipe(mergeMap((event: HttpEvent<any>) => this.handleResponse(event)));
    }

    private handleResponse(event: HttpEvent<any>): Observable<any>{
        if(event instanceof HttpResponse){
            if([401, 403].includes(event.status)){
                this.localStorage.clear();
                this.toastService.error(CONSTS.messages.request_fail);
                return throwError([]);
            }
        }
        return of(event);
    }
}