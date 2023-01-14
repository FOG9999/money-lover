import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class IconService {
    constructor(private http: HttpClient) {}
    
    getBase64Icon(path: string): Observable<string>{
        const api_name: string  = "api.v1.image.get.base64";
        return this.http.post<string>(environment.SERVER_URL, {api_name, path}, {observe: "body"});
    }
}