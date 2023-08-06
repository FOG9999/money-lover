import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { SecurityQuestion } from 'app/model/question.model';

@Injectable({providedIn: 'root'})
export class SecurityQuestionService {
    constructor(
        private http: HttpClient
    ) { }

    getListSecurityQuestions(search: string = ""){
        const api_name: string = "api.v1.securityquestion.list";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, search }, { observe: "body" });
    }

    addQuestion(question: Partial<SecurityQuestion>){
        const api_name: string = "api.v1.securityquestion.add";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, ...question }, { observe: "body" });
    }

    updateQuestion(question: Partial<SecurityQuestion>){
        const api_name: string = "api.v1.securityquestion.update";
        return this.http.post<SecurityQuestion[]>(environment.SERVER_URL, { api_name, ...question }, { observe: "body" });
    }
    
}