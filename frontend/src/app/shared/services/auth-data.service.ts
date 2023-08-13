import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthDataService {
    constructor() { }

    redirectFromAuthByQuestionChange$ = new BehaviorSubject<string>("/");
    
}