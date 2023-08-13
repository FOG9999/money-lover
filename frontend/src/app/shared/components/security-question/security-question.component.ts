import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SecurityQuestionService } from '@shared';
import { SecurityQuestion } from 'app/model/question.model';

@Component({
    selector: 'security-question',
    templateUrl: 'security-question.component.html'
})

export class SecurityQuestionComponent implements OnInit {
    constructor(
        private questionService: SecurityQuestionService,
    ) { }

    ngOnInit() { 
        this.getListQuestions();
    }

    listQuestions: Partial<SecurityQuestion>[] = [];
    questionOne: string;
    questionTwo: string;
    questionThree: string;
    formGroup: FormGroup = new FormGroup({
        answerOne: new FormControl("", [Validators.required]),
        answerTwo: new FormControl("", [Validators.required]),
        answerThree: new FormControl("", [Validators.required]),
    })
    isSaving: boolean = false;
    /**
     * is in authentication mode or creating account
     */
    @Input() isAuthMode: boolean = true;
    @Input() saveTitle: string = "Lưu thay đổi";
    @Input() title: string = "Tạo câu hỏi bảo mật";

    /**
     * callback function if user wants to go back where they were
     */
    @Input() goBackCallback: () => void;
    /**
     * callback when done saving changes
     */
    @Input() saveCallback: (questions: string[], answers: string[]) => void;

    getListQuestions(){
        this.questionService.getListSecurityQuestions("", 0, 1000).subscribe(res => {
            this.listQuestions = res.data;
        })
    }

    goBack(){
        if(typeof this.goBackCallback == 'function'){
            (<Function>this.goBackCallback)();
        }
        else {
            window.location.reload();
        }
    }

    saveQuestions(){
        const {answerOne, answerTwo, answerThree} = this.formGroup.value;
        this.isSaving = true;
        if(this.saveCallback){
            this.saveCallback([this.questionOne, this.questionTwo, this.questionThree], [answerOne, answerTwo, answerThree])
            this.isSaving = false;
        }
    }
}