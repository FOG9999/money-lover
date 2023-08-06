import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SecurityQuestionService } from '@shared';
import { SecurityQuestion } from 'app/model/question.model';
import { SecurityQuestionDetailComponent } from './security-question-detail/security-question-detail.component';

@Component({
    selector: 'security-question-mng',
    templateUrl: 'security-question-mng.component.html'
})

export class SecurityQuestionMngComponent implements OnInit {
    constructor(
        private questionService: SecurityQuestionService,
        private dialogService: MatDialog
    ) { }

    ngOnInit() { 
        this.searchQuestion()
    }

    listQuestions: Partial<SecurityQuestion>[] = [];
    searchKey: string = "";
    loading: boolean = false;

    getListQuestions(){
        this.questionService.getListSecurityQuestions(this.searchKey).subscribe(res => {
            this.loading = false;
            this.listQuestions = res;
        }, err => {
            this.loading = false;
        })
    }

    searchQuestion(){
        this.loading = true;
        this.getListQuestions()
    }

    open(question?: Partial<SecurityQuestion>){
        this.dialogService.open(SecurityQuestionDetailComponent, {
            data: {
                question: question ? question: {}
            },
            width: '400px'
        })
        .afterClosed().subscribe((res: undefined | Partial<SecurityQuestion>) => {
            if(res){
                this.searchQuestion();
            }
        })
    }

    delete(){

    }
}