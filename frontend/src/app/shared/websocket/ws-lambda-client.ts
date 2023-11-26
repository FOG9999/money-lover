import { environment } from "@env/environment";
import { ReconnectWS } from "app/consts";

export const createWSClient = (token: string, user: string) => {
    const client = new WebSocket(`${environment.WS_LAMBDA_URL}?user=${user}&t=${token}`);
    client.onopen = () => {
        console.log('websocket opened.');
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