import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Wallet } from 'app/model/wallet.model';

@Injectable()
export class WalletService {
    constructor(private http: HttpClient) { }
    
    getListWallets(search: any){
        const api_name: string = "api.v1.wallet.list";
        return this.http.post<Wallet[]>(environment.SERVER_URL, { api_name, ...search }, { observe: "body" });
    }

    saveWallet(wallet: Wallet){
        const api_name: string = "api.v1.wallet.add";
        return this.http.post<Wallet>(environment.SERVER_URL, { api_name, ...wallet }, { observe: "body" });
    }
}