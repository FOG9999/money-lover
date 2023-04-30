import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Wallet, WalletForm } from 'app/model/wallet.model';

@Injectable()
export class WalletService {
    constructor(private http: HttpClient) { }
    
    getListWallets(search: any){
        const api_name: string = "api.v1.wallet.list";
        return this.http.post<Wallet[]>(environment.SERVER_URL, { api_name, ...search }, { observe: "body" });
    }

    saveWallet(wallet: WalletForm){
        const api_name: string = "api.v1.wallet.add";
        return this.http.post<Wallet>(environment.SERVER_URL, { api_name, ...wallet }, { observe: "body" });
    }

    deleteWallet(ids: string[]){
        const api_name = "api.v1.wallet.delete";
        return this.http.post(environment.SERVER_URL, { api_name, ids }, { observe: "body" });
    }

    updateWallet(wallet: {
        _id: string,
        amount: number,
        walletType: string,
        includeInTotal: boolean
    }){
        const api_name = "api.v1.wallet.update";
        return this.http.post(environment.SERVER_URL, { api_name, ...wallet}, { observe: "body" });
    }

    getWallet(id: string){
        const api_name = "api.v1.wallet.get";
        return this.http.post<Wallet>(environment.SERVER_URL, { api_name, id }, { observe: "body" });
    }
}