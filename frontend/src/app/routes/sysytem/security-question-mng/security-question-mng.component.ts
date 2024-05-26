import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SecurityQuestionService } from '@shared';
import { SecurityQuestion } from 'app/model/question.model';
import { SecurityQuestionDetailComponent } from './security-question-detail/security-question-detail.component';
import { CONSTS } from 'app/consts';
import { ConfirmDeletionComponent } from '@shared/components/confirm-deletion/confirm-deletion.component';
import { ToastrService } from 'ngx-toastr';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'security-question-mng',
    templateUrl: 'security-question-mng.component.html'
})

export class SecurityQuestionMngComponent implements OnInit {
    constructor(
        private questionService: SecurityQuestionService,
        private dialogService: MatDialog,
        private toast: ToastrService
    ) { }

    ngOnInit() { 
        this.searchQuestion()
    }

    listQuestions: Partial<SecurityQuestion>[] = [];
    searchKey: string = "";
    loading: boolean = false;
    listChecked: Map<string, Partial<SecurityQuestion>> = new Map<string, Partial<SecurityQuestion>>();
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    page: number = 0;
    pageSizeOptions: number[] = CONSTS.page_size_options;

    getListQuestions(){
        this.questionService.getListSecurityQuestions(this.searchKey, this.page, this.pageSize).subscribe(res => {
            this.loading = false;
            this.listQuestions = res.data;
            this.total = res.total;
        }, err => {
            this.loading = false;
        })
    }

    resetListChecked(){
        this.listChecked.clear();
    }

    searchQuestion(){
        this.loading = true;
        this.getListQuestions()
    }

    open(question?: Partial<SecurityQuestion>, evt?: Event){
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
        if(evt){
            evt.stopPropagation()
        }
    }

    getNumOfSelected(){
        return this.listChecked.size;
    }

    delete(){   
        this.dialogService.open(ConfirmDeletionComponent, {
            data: {
                title: "Xác nhận xóa câu hỏi?",
                message: `Xóa vĩnh viễn ${this.getNumOfSelected()} câu hỏi?`
            }
        })
        .afterClosed().subscribe((isConfirmed: boolean | undefined) => {
            if (isConfirmed) {
                this.loading = true;
                this.questionService.deleteQuestion(this.listQuestions.filter((_, ind) => this.listChecked[ind]).map(item => item._id))
                .subscribe(res => {
                    this.loading = false;
                    this.toast.success("Xóa vĩnh viễn câu hỏi thành công");
                    this.searchQuestion();
                }, err => {
                    this.loading = false;
                    this.toast.error("Xóa vĩnh viễn câu hỏi thất bại")
                })                
            }
        })
    }

    onChangePage(evt: PageEvent){
        this.page = evt.pageIndex;
        this.pageSize = evt.pageSize;
        this.searchQuestion();
    }
}