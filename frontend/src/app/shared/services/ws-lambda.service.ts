import { Injectable } from '@angular/core';
import { createWSClient } from '@shared/websocket/ws-lambda-client';
import { LocalStorageService } from './storage.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class WSLambdaService {
    constructor(
        private localStorage: LocalStorageService,
        private notifyService: NotificationService,
    ) {}

    private wsClient: WebSocket;

    initClient() {
        if (this.localStorage.get("user") && this.localStorage.get("user").token && this.localStorage.get("user")._id && !this.wsClient) {
            createWSClient(this.localStorage.get("user").token, this.localStorage.get("user")._id, (client) => {
                this.wsClient = client;
                if(client && client instanceof WebSocket){
                    this.wsClient.onmessage = ({ data }) => { // MessageEvent type has 'data' prop, not the object was sent from websocket
                        console.log(`receive message: ${JSON.stringify(data)}`);
                        if(data){
                            try {                                
                                data = JSON.parse(data);
                                if(Object.keys(data).includes('notification')){
                                    this.notifyService.putNotification(data.notification);
                                    this.notifyService.notify(data.notification);
                                }
                                else {
                                    console.warn(`data from websocket doesnt is not a notification: `, data);
                                }
                            } catch (error) {
                                console.error(`Error parsing data from websocket: `, error);
                            }
                        }
                    }
                }
                else {
                    console.error(`client undefined`);
                }
            });
        }
    }

    endConnection() {
        if (this.wsClient) {
            this.wsClient.close();
        }
    }
}