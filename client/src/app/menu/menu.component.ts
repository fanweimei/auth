import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuNode, MenuType } from './interface';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { HttpResponse } from '@angular/common/http';
import { MenuNewComponent } from './menu-new.component';
import { FetchService } from '../core/fetch.service';
import { AuthService } from '../core/auth';
import Config from '../core/config';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styles: [`
    .g-menu {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .new-btn {
        margin: 10px;
        cursor: pointer;
        margin-left: 50%;
    }
    .menu-tip {
        padding-left: 20px;
    }
    .menu-tip span {
        font-size: 14px;
        font-weight: bold;
    }
    .menu-tip span li {
        line-height: 2em;
    }
  `]
})
export class MenuComponent implements OnInit {
    list = [];
    expandDataCache = {};
    dataSet = [];
    canEdit: boolean;
    canDelete: boolean;

    constructor(
        private modal: NzModalService,
        private fetchService: FetchService,
        private message: NzMessageService
    ) { }

    ngOnInit(): void {
        this.initData();
        const MENUAUTH = Config.MENUS.MENU;
        this.canEdit = !!AuthService.getResouceByKey([MENUAUTH.key, MENUAUTH.children.EDIT.key]);
        this.canDelete = !!AuthService.getResouceByKey([MENUAUTH.key, MENUAUTH.children.DELETE.key]);;
    }
    initData() {
        return new Promise(resolve => {
            this.fetchService.excuteSend({
                path: 'menu/listall'
            }).subscribe(result => {
                if (result) {
                    result.sort(function (item1, item2) {
                        const a = item1.sequence ? item1.sequence : 0;
                        const b = item2.sequence ? item2.sequence : 0;
                        return a - b;
                    });
                    this.list = AuthService.arrayToTree(result);
                    this.expandDataCache = {};
                    this.list.forEach(item => {
                        this.expandDataCache[item.id] = this.convertTreeToList(item);
                    });
                    this.dataSet = result;
                    resolve();
                }
            });
        });
    }

    collapse(array: MenuNode[], data: MenuNode, $event: boolean): void {
        if ($event === false) {
            if (data.children) {
                data.children.forEach(d => {
                    const target = array.find(a => a.id === d.id);
                    target.expand = false;
                    this.collapse(array, target, false);
                });
            } else {
                return;
            }
        }
    }

    convertTreeToList(root): MenuNode[] {
        const stack = [];
        const array = [];
        const hashMap = {};
        const list2 = [];
        stack.push({ ...root, level: 0, expand: false });
        while (stack.length !== 0) {
            const node = stack.pop();
            this.visitNode(node, hashMap, array);
            if (node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
                }
            }
        }
        return array;
    }

    visitNode(node: MenuNode, hashMap: object, array: MenuNode[]): void {
        if (!hashMap[node.id]) {
            hashMap[node.id] = true;
            array.push(node);
        }
    }

    showMenuNewPanel(type: MenuNode, pid: string, array: MenuNode[], source: any) {
        const sameDirAllKeys = this.findKeysInSameDir(pid, source ? source.id : null); // 找到相同父级下所有的keys值
        const modal = this.modal.create({
            nzWidth: 700,
            nzContent: MenuNewComponent,
            nzComponentParams: {
                type: type,
                pid: pid,
                source: source,
                sameDirAllKeys
            },
            nzOkText: null,
            nzCancelText: null
        });
        modal.afterClose.subscribe((result) => {
            if (!result) {
                return;
            }
            if (source) {
                const index = array.findIndex(item => item.id === source.id);
                array[index] = { ...source, ...result };
            } else {
                this.initData().then(() => {
                    this.expand(result.id);
                });
            }
        });
    }

    findKeysInSameDir(pid, id) {
        let rs;
        if (!pid) {
            rs = this.dataSet.filter(item => !item.pid);
        } else {
            rs = this.dataSet.filter(item => item.pid == pid);
        }
        if (id) {
            rs = rs.filter(item => item.id != id);
        }
        return rs.map(item => item.key);
    }

    expand(id, isSelf = false) {
        for (const item of this.list) {
            for (const node of this.expandDataCache[item.id]) {
                if (node.id === id) {
                    if (isSelf) {
                        node.expand = true;
                    }
                    let p = node.parent;
                    while (p) {
                        p.expand = true;
                        p = p.parent;
                    }
                    return;
                }
            }
        }
    }

    delete(tar) {
        this.modal.create({
            nzContent: '确定删除这条记录吗？',
            nzOnOk: () => {
                return this.fetchService.excuteSend({
                    path: 'menu/' + tar.id,
                    method: 'delete'
                }).subscribe(result => {
                    if (result) {
                        this.initData().then(() => {
                            const node = tar.parent;
                            if (node) {
                                this.expand(tar.parent.id, true);
                            }
                        });
                    }
                });
            }
        });
    }
}
