import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SecurityQuestionService, trim } from '@shared';
import { SecurityQuestion } from 'app/model/question.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'security-question-detail',
    templateUrl: 'security-question-detail.component.html'
})

export class SecurityQuestionDetailComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { question: Partial<SecurityQuestion> },
        public dialogRef: MatDialogRef<SecurityQuestionDetailComponent>,
        private questionService: SecurityQuestionService,
        private toast: ToastrService
    ) { }

    formGroup: FormGroup = new FormGroup({
        question: new FormControl("", [Validators.required]),
    })
    title: string = "Thêm mới câu hỏi bảo mật";
    loading: boolean = false;
    trim = trim;

    ngOnInit() {
        this.formGroup.get('question')?.setValue(this.data.question.question);
        if(this.data.question && this.data.question._id){
            this.title = "Chỉnh sửa câu hỏi bảo mật";
        }
    }

    save() {
        this.loading = true;
        if(this.data.question && this.data.question._id){
            this.questionService.updateQuestion({question: this.formGroup.get('question').value, _id: this.data.question._id})
                .subscribe(res => {
                    this.loading = false;
                    this.dialogRef.close(res);
                    this.toast.success("Cập nhật câu hỏi thành công")
                }, err => {
                    this.loading = false;
                })
        }
        else {
            this.questionService.addQuestion({question: this.formGroup.get('question').value})
                .subscribe(res => {
                    this.loading = false;
                    this.dialogRef.close(res)
                }, err => {
                    this.loading = false;
                })
        }
    }

    closeDialog() {
        this.dialogRef.close()
    }
}