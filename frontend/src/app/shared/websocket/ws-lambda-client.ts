import { environment } from "@env/environment";

export const createWSClient = (token: string, user: string) => {
    const client = new WebSocket(`${environment.WS_LAMBDA_URL}?user=${user}&t=${token}`);
    client.onopen = () => {
        console.log('websocket opened.');
    }
    
    client.onerror = (err) => {
        console.log('websocket error: ' + JSON.stringify(err));
    }
    
    client.onclose = () => {
        console.log("websocket closed");
    }

    return client;
}