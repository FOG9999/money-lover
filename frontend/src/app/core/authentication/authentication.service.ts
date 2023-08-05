import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from 'app/model/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        let api_name = "api.v1.systemuser.login";
        return this.http.post<User>(environment.SERVER_URL, {username, password, api_name}, {observe: 'body'})
    }

    createUser(data: {
        username: string,
        password: string,
        firstname: string,
        lastname: string,
        email: string,
        level: 'ADMIN' | 'SYSTEM' | 'USER'
    }){
        const api_name: string = "api.v1.systemuser.signup";
        return this.http.post(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    createUserOAuth(data: {
        username: string,
        password: string,
        firstname: string,
        lastname: string,
        email: string,
        level: 'ADMIN' | 'SYSTEM' | 'USER',
        authId: number | string
    }){
        const api_name: string = "api.v1.systemuser.signupwithoauth";
        return this.http.post<User>(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

}