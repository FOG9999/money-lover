import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Transaction } from 'app/model/transaction.model';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    constructor(
        private http: HttpClient
    ) { }

    insertTransaction(data: { category: string, note: string, wallet: string, amount: number, budget?: string }) {
        const api_name: string = "api.v1.transaction.add";
        return this.http.post(environment.SERVER_URL, { api_name, ...data }, { observe: "body" });
    }

    getListData(search: {
        from: Date,
        to: Date
    }) {
        let api: string = `api.v1.transaction.list`;
        return this.http.post<Transaction[]>(environment.SERVER_URL, { api_name: api, ...search }, { observe: "body" });
    }

    getTransaction(id: string){
        const api: string = "api.v1.transaction.get";
        return this.http.post<Transaction>(environment.SERVER_URL, { api_name: api, id }, { observe: "body" });
    }

}