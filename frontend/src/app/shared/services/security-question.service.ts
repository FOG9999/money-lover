import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CONSTS } from 'app/consts';
import { SecurityQuestion } from 'app/model/question.model';

@Injectable({providedIn: 'root'})
export class SecurityQuestionService {
    constructor(
        private http: HttpClient
    ) { }

    getListSecurityQuestions(search: string = "", page: number = 0, size: number = CONSTS.page_size){
        const api_name: string = "api.v1.securityquestion.list";
        return this.http.post<{data: SecurityQuestion[], total: number}>(environment.SERVER_URL, { api_name, search, page, size }, { observe: "body" });
    }

    addQuestion(question: Partial<SecurityQuestion>){
        const api_name: string = "api.v1.securityquestion.add";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, ...question }, { observe: "body" });
    }

    updateQuestion(question: Partial<SecurityQuestion>){
        const api_name: string = "api.v1.securityquestion.update";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, ...question }, { observe: "body" });
    }

    deleteQuestion(ids: string[]){
        const api_name: string = "api.v1.securityquestion.delete";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, ids }, { observe: "body" });
    }

    /**
     * use ONLY when user update their questions, NOT when creating new account
     */
    answerQuestion(questions: string[], answers: string[]){
        const api_name: string = "api.v1.securityquestion.useranswer";
        return this.http.post(environment.SERVER_URL, { api_name, questions, answers }, { observe: "body" });
    }
    
}