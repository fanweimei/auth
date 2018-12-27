import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { RoleNewComponent } from './role-new.component';
import { RoleAddUserComponent } from './role-add-user.component';
import { FetchService } from '../core/fetch.service';
import Config from '../core/config';
import { AuthService } from '../core/auth';

@Component({
    selector: 'role-list',
    templateUrl: './role.component.html',
    styles: [`
        .role-btn {
            margin: 10px;
        }
    `]
})
export class RoleComponent implements OnInit {
    roleList: Array<any>;
    canEdit: boolean;
    canDelete: boolean;
    canAddUser: boolean;
    canAddAuth: boolean;
    confirmModal: NzModalRef;
    loading = false;
    total = 0;
    page = 1;
    pageSize = 10;

    constructor(
        private fetchService: FetchService,
        private modal: NzModalService,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit() {
        this.requestRoles(true);
        const ROLEAUTH = Config.MENUS.ROLE;
        this.canEdit = !!AuthService.getResouceByKey([ROLEAUTH.key, ROLEAUTH.children.EDIT.key]);
        this.canAddUser = !!AuthService.getResouceByKey([ROLEAUTH.key, ROLEAUTH.children.SETUSER.key]);;
        this.canAddAuth = !!AuthService.getResouceByKey([ROLEAUTH.key, ROLEAUTH.children.SETAUTH.key]);;
        this.canDelete = !!AuthService.getResouceByKey([ROLEAUTH.key, ROLEAUTH.children.DELETE.key]);;
    }
    requestRoles(isFirst = false) {
        if (isFirst) {
            this.page = 1;
        }
        this.loading = true;
        this.fetchService.excuteSend({
            path: 'role',
            method: 'get',
            isLoading: false
        }).subscribe(result => {
            if (result) {
                this.roleList = result.items;
                this.total = result.totalItems;
            }
            this.loading = false;
        });
    }

    delRole(tar) {
        this.fetchService.excuteSend({
            path: `role/${tar.id}`,
            method: 'delete',
            tip: {
                success: '成功删除'
            }
        }).subscribe(result => {
            if (result) {
                this.roleList = this.roleList.filter(item => item.id !== tar.id);
            }
        });
    }
    addRole(source) {
        const modal = this.modal.create({
            nzContent: RoleNewComponent,
            nzComponentParams: {
                source: source
            },
            nzOkText: null,
            nzCancelText: null
        });
        modal.afterClose.subscribe((update) => {
            if (update) {
                this.requestRoles();
            }
        });
    }
    setUser(item) {
        const modal = this.modal.create({
            nzContent: RoleAddUserComponent,
            nzComponentParams: {
                roleId: item.id
            },
            nzOnOk: (component) => {
                return new Promise(resolve => {
                    component.submit(resolve);
                });
            }
        });
    }
    setResMap(item) {
        this.router.navigate(['/role-add-auth/' + item.id + '/' + item.name]);
    }
}
