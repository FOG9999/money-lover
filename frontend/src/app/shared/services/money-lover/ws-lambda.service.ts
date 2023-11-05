import { Injectable } from '@angular/core';
import { createWSClient } from '@shared/websocket/ws-lambda-client';
import { LocalStorageService } from '../storage.service';

@Injectable({providedIn: 'root'})
export class WSLambdaService {
    constructor(private localStorage: LocalStorageService) { 
    }
    
    private wsClient: WebSocket;
    
    initClient(){
        if(this.localStorage.get("user") && this.localStorage.get("user").token && this.localStorage.get("user")._id && !this.wsClient){
            this.wsClient = createWSClient(this.localStorage.get("user").token, this.localStorage.get("user")._id);
        }
    }

    endConnection(){
        if(this.wsClient){
            this.wsClient.close();
        }
    }
}