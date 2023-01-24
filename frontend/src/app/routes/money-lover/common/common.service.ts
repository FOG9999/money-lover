import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Icon } from 'app/model/icon.model';
import { Category } from 'app/model/category.model';

@Injectable()
export class CommonService {

    constructor(private http: HttpClient) {}

    getListData(model: string, search: any){
        let api: string = `api.v1.${model}.list`;
        return this.http.post<Icon[]>(environment.SERVER_URL, {...search, api_name: api}, {observe: "body"});
    }

    getListCategories(search: any){
        const api_name: string = "api.v1.category.list";
        return this.http.post<Category[]>(environment.SERVER_URL, {api_name, ...search}, {observe: "body"});
    }

    insertCategory(data: {name: string, icon: string}){
        const api_name: string = "api.v1.category.add";
        return this.http.post<Category[]>(environment.SERVER_URL, {api_name, ...data}, {observe: "body"});
    }

    updateCategory(data: {name: string, icon: string, id: string}){
        const api_name: string = "api.v1.category.update";
        return this.http.post<Category[]>(environment.SERVER_URL, {api_name, ...data}, {observe: "body"});
    }
}