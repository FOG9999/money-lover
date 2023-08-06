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
        private questionService: SecurityQuestionService
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

    /**
     * callback function if user wants to go back where they were
     */
    @Input() goBackCallback: () => void;
    /**
     * callback when done saving changes
     */
    @Input() saveCallback: () => void;

    getListQuestions(){
        this.questionService.getListSecurityQuestions().subscribe(res => {
            this.listQuestions = res;
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
}