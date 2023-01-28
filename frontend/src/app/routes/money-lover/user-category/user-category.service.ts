import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Icon } from 'app/model/icon.model';
import { Category } from 'app/model/category.model';

@Injectable()
export class UserCategoryService {
    constructor(private http: HttpClient) { }
    
}