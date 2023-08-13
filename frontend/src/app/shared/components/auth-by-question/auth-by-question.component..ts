import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityQuestionService } from '@shared';
import { AuthDataService } from '@shared/services/auth-data.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'auth-by-question',
    templateUrl: 'auth-by-question.component.html'
})

export class AuthByQuestionComponent implements OnInit, OnDestroy {
    constructor(
        private questionService: SecurityQuestionService,
        private toast: ToastrService, 
        private router: Router,
        private authDataService: AuthDataService
    ) { 
        this.authDataService.redirectFromAuthByQuestionChange$.pipe(takeUntil(this.destroy$))
        .subscribe(res => {
            this.redirectUrl = res;
        })
    }

    redirectUrl: string = "";
    destroy$ = new Subject();

    ngOnInit() { 
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    saveCallback = (questions: string[], answers: string[]) => {
        this.questionService.authUserByQuestions(questions, answers).subscribe(res => {
            if(res.isAuth){
                this.toast.success("Xác thực người dùng thành công");
                this.router.navigateByUrl(this.redirectUrl);
            }
            else {
                this.failback();
            }
        })  
    }

    failback = () => {
        this.toast.error("Xác thực người dùng thất bại. Vui lòng đăng nhập lại");
        this.router.navigateByUrl('/auth/login');
    }
}