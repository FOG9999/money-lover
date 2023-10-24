import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { LocalStorageService, getResponseErrorMessage } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { CONSTS } from 'app/consts';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private localStorage: LocalStorageService, private toastService: ToastrService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('login') || req.url.includes('register')) {
            return next.handle(req);
        }
        let authReq = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + this.localStorage.get("user").token)
        });
        return next.handle(authReq).pipe(catchError((event: HttpErrorResponse) => this.handleErrorResponse(event)));
    }

    private handleErrorResponse(event: HttpErrorResponse): Observable<any> {
        if ([401, 403].includes(event.status)) {
            this.localStorage.clear();
            this.toastService.error(CONSTS.messages.request_fail);
            setTimeout(() => {
                window.location.href = "/"
            });
        }
        if(event.status == 400){
            this.toastService.error(getResponseErrorMessage(event.error.message))
        }
        if(event.status == 500){
            this.toastService.error("Lỗi hệ thống")
        }
        return throwError(event);
    }
}