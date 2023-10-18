import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AppStorageService {
    constructor() { }
    
    /**
     * check if user redirected from profile page
     */
    redirectFromProfile: boolean = false;
}