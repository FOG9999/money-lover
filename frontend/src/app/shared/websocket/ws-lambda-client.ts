import { environment } from "@env/environment";
import { NotificationConst, ReconnectWS } from "app/consts";

export const createWSClient = (token: string, user: string) => {
    const client = new WebSocket(`${environment.WS_LAMBDA_URL}?user=${user}&t=${token}`);
    client.onopen = () => {
        console.log('websocket opened.');
        updateConnectionKey(client);
    }
    
    client.onerror = (err) => {
        console.log('websocket error: ' + JSON.stringify(err));
    }
    
    client.onclose = () => {
        console.log(`websocket closed. Trying to reconnect in ${ReconnectWS/1000}s`);
        setTimeout(() => {        
            createWSClient(token, user);
        }, ReconnectWS);
    }

    return client;
}

const updateConnectionKey = (wsClient: WebSocket) => {
    let cKey = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).cKey: "";
    if(cKey){
        wsClient.send(JSON.stringify({cKey, message: NotificationConst.CONNECTION_KEY}));
    }   
    else {
        wsClient.close();
        console.error("connection key not exist");
    }
}