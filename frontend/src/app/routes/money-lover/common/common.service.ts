import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Icon } from 'app/model/icon.model';

@Injectable()
export class CommonService {

    constructor(private http: HttpClient) {}

    getListData(model: string, search: any){
        let api: string = `api.v1.${model}.list`;
        return this.http.post<Icon[]>(environment.SERVER_URL, {...search, api_name: api}, {observe: "body"});
    }
}