import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PassportLoginService } from '@shared';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'redirect',
    templateUrl: 'redirect.component.html'
})

export class RedirectComponent implements OnInit, OnDestroy {
    constructor(
        private passportService: PassportLoginService,
        private route: ActivatedRoute
    ) { 
        this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.access_token = params['access_token'];
        })
    }

    private access_token: string;
    private destroy$ = new Subject();

    ngOnInit() { 
        this.passportService.getGithubUserByToken(this.access_token).subscribe(user => {
            console.log(user);
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}