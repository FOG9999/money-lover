import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { GithubUser } from 'app/model/github-user.model';
import { Icon } from 'app/model/icon.model';

@Injectable({providedIn: 'root'})
export class PassportLoginService {
    constructor(private http: HttpClient) { }

    getGithubUserByToken(access_token: string) {
        return this.http.post<GithubUser>(`${environment.PassportLoginServerURL}/github/user`, { access_token }, { observe: "body" });
    }
    
}