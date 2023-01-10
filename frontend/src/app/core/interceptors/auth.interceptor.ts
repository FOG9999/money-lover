import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('login') || req.url.includes('register')) {
            return next.handle(req);
        }
        let authReq = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem("token"))
        });        
        return next.handle(authReq);
    }
}