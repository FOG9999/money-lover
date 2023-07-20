import { Component, OnInit } from '@angular/core';
import { User } from 'app/model/user.model';
import { UsersService } from './users.service';

@Component({
    selector: 'users-list',
    templateUrl: 'users.component.html'
})

export class UsersListComponent implements OnInit {
    constructor(
        private usersService: UsersService
    ) { }

    ngOnInit() { 
        this.searchUsers();
    }

    searchKey: string = "";
    userList: Partial<User>[] = [];
    displayedColumns: string[] = ['username','firstname','lastname'];

    addUser(){

    }

    deactivate(){

    }

    delete(){

    }

    searchUsers(){
        this.usersService.getListData({
            search: this.searchKey
        }).subscribe(res => {
            this.userList = res;
        })
    }
}