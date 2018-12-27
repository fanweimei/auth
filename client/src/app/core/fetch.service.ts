import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzMessageService, NzTreeNode } from 'ng-zorro-antd';
import Config from './config';
import Tool from './tool';

interface LogData {
    from?;
    action?;
    path?;
    method?;
    data?;
}
interface RequestData {
    path;
    data?;
    from?;
    method?;
    isLoading?;
    ip?;
    doCancel?;
    tip?;
    options?;
    allreturn?;
}

@Injectable()
export class FetchService {
    public from: string;
    // 用户id
    public userId = '';
    public isLogined = false; // 标识登录的状态

    constructor(
        private http: HttpClient,
        private message: NzMessageService,
        private router: Router
    ) {
        this.from = '';
    }
    // 向后台发送日志
    sendLog(data: LogData) {
        const from = data.from || '';
        const action = data.action || '';
        const method = data.method || 'get';
        const path = data.path || '';
        const url = Config.IP + 'audit';
        const body = {
            user: path == 'user/login' ? data.data['username'] : localStorage.getItem('username') ? localStorage.getItem('username') : '',
            module: from,
            action: action,
            method: method,
            requestBody: JSON.stringify(data.data),
            responseCode: 200,
            type: 'common',
            url: path
        };
        this.http.post(url, body).subscribe(
            rs => {
                console.log('日志:', rs);
            },
            err => {
                console.warn('日志错误:', err);
            }
        );
    }
    excuteSend(params: RequestData) {
        let data = params.data || {};
        let method = params.method || 'get';
        const isLoading = params.isLoading === undefined ? true : params.isLoading;
        const path = params.path || '';
        const from = params.from || '';
        const ip = params.ip || Config.IP;
        if (isLoading) {
            Tool.showloading(false, null);
        }
        method = method.toUpperCase();
        const observe: HttpObserve = 'response';
        let options = {
            observe: observe,
            headers: {
                ContentType: 'application/json;charset=UTF-8',
                token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
            }
        };
        if (params.options) {
            options = { ...params.options, ...options };
        }
        let url = ip + path;
        if (!['POST', 'DELETE', 'PUT'].includes(method)) {
            let exp = (url.indexOf('?') > 0) ? '&' : '?';
            for (const i in data) {
                if (data.hasOwnProperty(i)) {
                    url += (exp + i + '=' + data[i]);
                    exp = '&';
                }
            }
            // url += (exp + 'trx_random=' + new Date().getTime());
            data = {};
        }
        options['body'] = data;
        const observable = Observable.create(observer => {
            this.http.request(method, url, options).subscribe(
                (res: HttpResponse<{ code: number, result: any, message: string }>) => {
                    const token = res.headers.get('token');
                    if (token) {
                        localStorage.setItem('token', token);
                    }
                    if (params.allreturn) {
                        observer.next(res);
                    } else {
                        if (res.body.code === 0) {
                            observer.next(res.body.result);
                            params.tip && this.message.success(params.tip.success || '执行成功');
                        } else {
                            observer.next(null);
                            params.tip && this.message.error(params.tip.fail || res.body.message);
                        }
                    }
                },
                error => {
                    if (isLoading === true) {
                        Tool.hideloading();
                    }
                    if (error.message) {
                        this.message.create("error", error.message);
                    }
                    observer.error(error);
                },
                () => {
                    if (isLoading === true) {
                        Tool.hideloading();
                    }
                    observer.complete();
                }
            );
        });
        // 发送后台日志
        if (!window['dev'] && from && path !== 'audit') {
            const logData: LogData = {
                from: from,
                path: path,
                method: method.toLowerCase(),
                data: data
            };
            this.sendLog(logData);
        }

        return observable;
    }

    /**
    * 退出账号
    */
    async signout() {
        this.isLogined = false;
        const userId = localStorage.getItem('userId') || '';
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        localStorage.removeItem('authIds');
        localStorage.removeItem('username');
        localStorage.removeItem('pages');
        localStorage.removeItem('userId');
        const result = await this.router.navigate(['login']);
        if (result && userId) {
            this.excuteSend({
                ip: Config.IP,
                path: `user/token?userId=${userId}`,
                isLoading: false,
                method: 'delete'
            }).subscribe(() => { });
        }
    }
}