import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';
import { AuthService } from '../core/auth';

@Component({
    selector: 'role-res-map',
    template: `
        <div class="role-tree">
            <nz-alert nzType="info" [nzMessage]="'当前设置角色：'+rolename"></nz-alert>
            <nz-tree
                [nzData]="list"
                [nzCheckable]="true"
                [nzCheckedKeys]="checkedKeys"
                nzDefaultExpandAll="true"
                (nzCheckBoxChange)="checkboxChange($event)">
                <ng-template #nzTreeTemplate let-node>
                    <span class="custom-node" draggable="true" aria-grabbed="true" [class.active]="node.isSelected">
                    <span>
                        <i nz-icon type="file" *ngIf="node.isLeaf&&node.origin.routepath"></i>
                        <i nz-icon type="api" *ngIf="node.isLeaf&&!node.origin.routepath"></i>
                         {{node.title}}
                    </span>
                    </span>
                </ng-template>
            </nz-tree>
            <div class="g-btn">
                <button nz-button [nzType]="'primary'" (click)="onSubmit()">
                    保存修改
                </button>
            </div>
        </div>
    `,
    styles: [`
        .role-tree {
            position: relative;
            padding: 0 20px;
            box-sizing: border-box;
        }
        nz-alert {
            width: 500px;
            margin: 20px 0;
        }
        .g-btn {
            position: fixed;
            right: 30px;
            bottom: 20px;
        }
    `]
})
export class RoleAddAuthComponent implements OnInit {
    id = '';
    rolename = '';
    list: Array<any> = [];
    menuIds = [];
    checkedKeys = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private fetchService: FetchService,
        private message: NzMessageService
    ) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            const id = params.get('id');
            const name = params.get('name');
            if (id !== '-1') {
                this.id = id;
                this.rolename = name;
                this.initData(id);
            }
        });
    }

    async initData(id) {
        await new Promise(resolve => {
            this.fetchService.excuteSend({
                path: 'role/getmenus',
                data: {
                    roleId: id
                }
            }).subscribe(result => {
                if (result) {
                    this.menuIds = result.map(item => item.id);
                    resolve();
                }
            });
        });
        this.fetchService.excuteSend({
            path: 'menu/listall'
        }).subscribe(result => {
            if (result) {
                const list = [];
                const array = AuthService.arrayToTree(result);
                const root = this.copyTree({ name: 'root', id: -1, children: array }, 0);
                for (const item of root.children) {
                    item.expanded = true;
                    list.push(new NzTreeNode(item));
                }
                this.list = list;
                // console.log(this.checkedKeys)
            }
        });
    }

    copyTree(root, level) {
        let newNode = {
            title: root.name,
            key: root.id,
            isLeaf: root.children ? false : true,
            label: root.classname,
            routepath: root.routepath,
            children: null,
            checked: false,
            type: root.type
        }
        if (root.children) {
            newNode.children = []
            for (const child of root.children) {
                const childNode = this.copyTree(child, level + 1);
                newNode.children.push(childNode);
            }
        } else if (this.menuIds.includes(root.id)) {
            this.checkedKeys.push(root.id);
            newNode.checked = true;
        }
        return newNode;
    }

    getMenuIds(root, ids: Array<any>) {
        if (root.isChecked || root.isHalfChecked) {
            ids.push({
                id: root.key
            });
            // if (root.origin.remark !== 'view' && root.parentNode && root.parentNode.children) {
            //     for (const child of root.parentNode.children) {
            //         if (child.origin.remark === 'view') {
            //             ids.push({
            //                 id: child.key
            //             });
            //             break;
            //         }
            //     }
            // }
        }
        if (root.children) {
            for (const child of root.children) {
                this.getMenuIds(child, ids);
            }
        }
    }

    checkboxChange(e) {
        // 如果一个页面中包含删除、添加、修改的权限，那么取消这些权限，不代表不能查看这个页面的数据
        const target = e.node.parentNode;
        if (!e.node.isChecked && target && target.origin.type == 'page') {
            if (target.isHalfChecked) {
                return;
            }
            if (target.children.length > 1) {
                target.isHalfChecked = true;
            } else {
                target.isChecked = true;
            }
        }
    }


    onSubmit() {
        const ids = [];
        this.getMenuIds({ children: this.list }, ids);
        this.fetchService.excuteSend({
            path: 'role/setmenus',
            method: 'post',
            data: {
                menuIds: ids,
                roleId: this.id
            },
            tip: {
                success: '设置成功'
            }
        }).subscribe(result => {
            if (result) {
                this.router.navigate(['/role']);
            }
        });
    }

}
