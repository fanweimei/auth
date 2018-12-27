import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import md5 from 'js-md5';
import { Router } from '@angular/router';
import { FetchService } from '../core/fetch.service';
import { UserNewComponent } from './user-new.component';
import { AuthService } from '../core/auth';
import Config from '../core/config';

@Component({
    selector: 'user-list',
    templateUrl: './user.component.html',
    styles: [`
        .user-btn {
            margin: 10px;
        }
    `]
})
export class UserComponent implements OnInit {
    userList: Array<any>;
    canEdit: boolean;
    canDelete: boolean;
    confirmModal: NzModalRef;
    loading = false;
    total = 0;
    page = 1;
    pageSize = 10;

    constructor(
        private fetchService: FetchService,
        private modal: NzModalService,
        private message: NzMessageService,
        private route: Router
    ) { }

    ngOnInit() {
        this.requestUsers(true);
        const USERAUTH = Config.MENUS.USER;
        this.canEdit = !!AuthService.getResouceByKey([USERAUTH.key, USERAUTH.children.EDIT.key]);
        this.canDelete = !!AuthService.getResouceByKey([USERAUTH.key, USERAUTH.children.DELETE.key]);
    }

    requestUsers(isFirst = false) {
        if (isFirst) {
            this.page = 1;
        }
        this.loading = true;
        this.fetchService.excuteSend({
            path: 'user',
            method: 'get',
            isLoading: false,
            data: {
                pageSize: this.pageSize,
                page: this.page
            }
        }).subscribe(result => {
            if (result) {
                this.total = result.totalItems;
                this.userList = result.items;
            }
            this.loading = false;
        });
    }

    delUser(tar) {
        this.fetchService.excuteSend({
            path: 'user/' + tar.id,
            method: 'delete',
            tip: {
                success: '成功删除'
            }
        }).subscribe(result => {
            if (result) {
                this.userList = this.userList.filter(item => item.id !== tar.id);
            }
        });
    }
    // 重置密码
    resetPass(user) {
        if (user.id) {
            this.fetchService.excuteSend({
                path: 'user/' + user.id,
                method: 'put',
                data: {
                    password: md5('123456')
                },
                tip: {
                    success: '重置成功，初始密码为：123456'
                }
            }).subscribe();
        } else {
            this.message.create('error', '该用户不存在');
        }
    }

    addUser(tar) {
        // this.route.navigate(['manager/auth/user-new', id]);
        const modal = this.modal.create({
            nzContent: UserNewComponent,
            nzComponentParams: {
                source: tar
            },
            nzOkText: null,
            nzCancelText: null
        });
        modal.afterClose.subscribe((update) => {
            if (update) {
                this.requestUsers();
            }
        });
    }
}
