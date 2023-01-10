import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { User } from 'app/model/user.model';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {}

    login(username: string, password: string) {
        let api_name = "api.v1.systemuser.login";
        return this.http.post<User>(environment.SERVER_URL, {username, password, api_name})
    }

}