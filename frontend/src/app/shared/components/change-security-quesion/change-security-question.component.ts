import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityQuestionService } from '@shared';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'change-security-question',
    templateUrl: 'change-security-question.component.html'
})

export class ChangeSecurityQuestionComponent implements OnInit, OnDestroy {
    constructor(
        private questionService: SecurityQuestionService,
        private toast: ToastrService, 
        private router: Router,
    ) { 
    }

    redirectUrl: string = "";
    destroy$ = new Subject();
    numOfTry: number = 0;

    @Input() onSave: () => void;
    @Input() goback: () => void;

    ngOnInit() { 
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    saveCallback = (questions: string[], answers: string[]) => {
        this.questionService.answerQuestion(questions, answers).subscribe(res => {
            this.toast.success("Thay đổi câu hỏi bảo mật thành công");
            this.onSave();
        }, err => {
            this.failback();
        })  
    }

    failback = () => {
        this.toast.error("Thay đổi câu hỏi bảo mật thất bại. Vui lòng thủ lại");
        if(this.numOfTry == 3){
            this.router.navigateByUrl('/auth/login');
        }
        else {
            this.numOfTry = this.numOfTry + 1;
        }
    }
}