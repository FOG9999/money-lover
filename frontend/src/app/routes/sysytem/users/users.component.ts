import { Component, OnInit } from '@angular/core';
import { User } from 'app/model/user.model';
import { UsersService } from './users.service';
import { CONSTS } from 'app/consts';

@Component({
    selector: 'users-list',
    templateUrl: 'users.component.html',
    styleUrls: ['users.component.scss']
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
    displayedColumns: string[] = ['action','Username', 'Họ Tên', 'Email', 'Trạng thái'];
    columnProps: string[] = ['action','username','fullname', 'email', 'status'];
    total: number = 0;
    pageSize: number = CONSTS.page_size;
    pageSizeOptions: number[] = CONSTS.page_size_options;
    listChecked: Set<string> = new Set<string>();

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
            this.userList = res.results;
            this.total = res.total;
        })
    }

    isCheckAll(){
        let isCheckedAll = true;
        for (let index = 0; index < this.userList.length; index++) {
            const element = this.userList[index];            
            if(!this.listChecked.has(element._id)){
                isCheckedAll = false;
                break;
            }
        }
        return isCheckedAll;
    }
}