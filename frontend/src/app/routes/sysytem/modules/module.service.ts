import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CONSTS } from 'app/consts';
import { Module } from 'app/model/module.model';

@Injectable({providedIn: 'root'})
export class ModuleService {
    constructor(
        private http: HttpClient
    ) { }

    getListModules(search: string = "", page: number = 0, size: number = CONSTS.page_size){
        const api_name: string = "api.v1.module.list";
        return this.http.post<{results: Module[], total: number}>(environment.SERVER_URL, { api_name, search, page, size }, { observe: "body" });
    }

    addModule(module: Partial<Module>){
        const api_name: string = "api.v1.module.add";
        return this.http.post<Module>(environment.SERVER_URL, { api_name, ...module }, { observe: "body" });
    }

    updateModule(module: Partial<Module>){
        const api_name: string = "api.v1.module.update";
        return this.http.post<Module>(environment.SERVER_URL, { api_name, ...module }, { observe: "body" });
    }

    deleteModule(ids: string[]){
        const api_name: string = "api.v1.module.delete";
        return this.http.post<Module[]>(environment.SERVER_URL, { api_name, ids }, { observe: "body" });
    }

    changeStatusModule(ids: string[], status: 0 | 1){
        const api_name: string = "api.v1.module.changestatus";
        return this.http.post<Module[]>(environment.SERVER_URL, { api_name, ids, status }, { observe: "body" });
    }

    getModule(id: string){
        const api_name: string = "api.v1.module.get";
        return this.http.post<Module>(environment.SERVER_URL, { api_name, id }, { observe: "body" });
    }

    getModulesByIds(ids: string[]){
        const api_name: string = "api.v1.module.getbyids";
        return this.http.post<{results: Module[]}>(environment.SERVER_URL, { api_name, ids }, { observe: "body" });
    }
    
}