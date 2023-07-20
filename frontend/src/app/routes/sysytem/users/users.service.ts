import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { User } from 'app/model/user.model';

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }

    getListData(search: Object) {
        let api: string = `api.v1.systemuser.list`;
        return this.http.post<Partial<User>[]>(environment.SERVER_URL, { ...search, api_name: api }, { observe: "body" });
    }
    
}