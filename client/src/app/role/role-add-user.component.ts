import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';

@Component({
    selector: 'role-add-user',
    template: `
        <nz-transfer
            [nzDataSource]="list"
            [nzTitles]="['待加入用户', '已加入用户']"
            [nzListStyle]="{'height.px': 400}"
            (nzChange)="change($event)">
        </nz-transfer>
    `
})
export class RoleAddUserComponent implements OnInit {
    @Input() roleId;
    list: Array<any> = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fetchService: FetchService,
        private message: NzMessageService,
        private modal: NzModalRef
    ) { }

    async ngOnInit() {
        this.initData();
    }
    async initData() {
        let userIds: Array<any>;
        await new Promise((resolve, reject) => {
            this.fetchService.excuteSend({
                path: 'role/getusers',
                method: 'get',
                data: {
                    roleId: this.roleId
                }
            }).subscribe(result => {
                if (result) {
                    userIds = result.map(item => item.id);
                    resolve(userIds);
                }
            });
        });
        this.fetchService.excuteSend({
            path: 'user/listall',
            method: 'get',
            isLoading: false
        }).subscribe(result => {
            this.list = result.map(item => {
                return {
                    key: item.id,
                    title: item.username,
                    direction: userIds.indexOf(item.id) !== -1 ? 'right' : 'left',
                };
            });
        });
    }

    change(ret: { list: any, from: string, to: string }): void {
        for (const item of ret.list) {
            item.direction = ret.to;
        }
    }

    submit(resolve) {
        const userIds = [];
        for (const item of this.list) {
            if (item.direction === 'right') {
                userIds.push({
                    id: item.key
                });
            }
        }
        this.fetchService.excuteSend({
            path: 'role/setusers',
            method: 'post',
            data: {
                roleId: this.roleId,
                userIds: userIds
            },
            tip: {
                success: '设置成功'
            }
        }).subscribe(() => {
            setTimeout(() => {
                this.modal.destroy();
            }, 500);
            resolve();
        });
    }
}

