import { Injectable } from '@angular/core';
import { createWSClient } from '@shared/websocket/ws-lambda-client';
import { LocalStorageService } from './storage.service';
import { NotificationService } from './notification.service';
import { NotificationConst } from 'app/consts';

@Injectable({ providedIn: 'root' })
export class WSLambdaService {
    constructor(
        private localStorage: LocalStorageService,
        private notifyService: NotificationService,
    ) {}

    private wsClient: WebSocket;

    initClient() {
        if (this.localStorage.get("user") && this.localStorage.get("user").token && this.localStorage.get("user")._id && !this.wsClient) {
            this.wsClient = createWSClient(this.localStorage.get("user").token, this.localStorage.get("user")._id);
            this.wsClient.onmessage = ({ data }) => { // MessageEvent type has 'data' prop, not the object was sent from websocket
                this.notifyService.setNotificationCount(this.notifyService.getNotificationCount() + 1);
                console.log(`receive message: ${JSON.stringify(data)}`);
                data = JSON.parse(data);
                if (data.topic == NotificationConst.WARNING_LOGIN) {
                    this.notifyService.warningLogin(data.notification);
                }
            }
        }
    }

    endConnection() {
        if (this.wsClient) {
            this.wsClient.close();
        }
    }
}