import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { CONSTS } from 'app/consts';
import { Role } from 'app/model/role.model';

@Injectable({providedIn: 'root'})
export class RoleService {
    constructor(
        private http: HttpClient
    ) { }

    getListRoles(search: string = "", page: number = 0, size: number = CONSTS.page_size){
        const api_name: string = "api.v1.role.list";
        return this.http.post<{results: Role[], total: number}>(environment.SERVER_URL, { api_name, search, page, size }, { observe: "body" });
    }

    addRole(role: Partial<Role>){
        const api_name: string = "api.v1.role.add";
        return this.http.post<Role>(environment.SERVER_URL, { api_name, ...role }, { observe: "body" });
    }

    updateRole(role: Partial<Role>){
        const api_name: string = "api.v1.role.update";
        return this.http.post<Role>(environment.SERVER_URL, { api_name, ...role }, { observe: "body" });
    }

    deleteRole(ids: string[]){
        const api_name: string = "api.v1.role.delete";
        return this.http.post<Role[]>(environment.SERVER_URL, { api_name, ids }, { observe: "body" });
    }

    changeStatusRole(ids: string[], status: 0 | 1){
        const api_name: string = "api.v1.role.changestatus";
        return this.http.post<Role[]>(environment.SERVER_URL, { api_name, ids, status }, { observe: "body" });
    }

    getRole(id: string){
        const api_name: string = "api.v1.role.get";
        return this.http.post<Role>(environment.SERVER_URL, { api_name, id }, { observe: "body" });
    }
    
}