import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd';
import { FetchService } from './fetch.service';
import config from './config';
import { AuthService } from './auth';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(
        private fetchService: FetchService,
        private router: Router,
        private modalService: NzModalService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        let url: string = state.url;
        return this.checkLogin(url);
        // return true;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(path: string): any {
        const url = path.split('?')[0];
        return Observable.create(observer => {
            this.fetchService.excuteSend({
                path: 'v1/user/verify',
                ip: config.IP,
                isLoading: false,
                allreturn: true
            }).subscribe((result: HttpResponse<any>) => {
                /**
                 * 三种情况：
                 * （1）0表示token有效
                 * （2）-1表示token无效
                 * （3）1表示账号在其它地方登录
                 */
                switch (result.body.code) {
                    case 0:
                        this.fetchService.isLogined = true;
                        const token = result.body.token;
                        if (token) {
                            localStorage.setItem('token', token);
                        }
                        if (url === '/login') {
                            const to = AuthService.from ? AuthService.from : '';
                            this.router.navigate([to])
                            observer.next(false);
                        } else if (url === '/' || url === '/messages') {
                            observer.next(true);
                        } else if (AuthService.existPageByPath(url)) {
                            observer.next(true);
                        } else {
                            // this.router.navigate(['notfound']);
                            observer.next(false);
                        }
                        break;
                    case -1:
                        this.fetchService.isLogined = false;
                        if (url !== '/login') {
                            AuthService.from = url;
                            this.fetchService.signout();
                            observer.next(false);
                        } else {
                            observer.next(true);
                        }
                        break;
                    case 1:
                        this.fetchService.isLogined = false;
                        if (url !== '/login') {
                            observer.next(false);
                            const modal = this.modalService.create({
                                nzContent: `你的账号于${format(parseInt(result.body.time), 'YYYY-MM-DD HH:mm')}在IP为${result.body.ip}处已登录，如果这不是你的操作，你登录密码可能已泄露，请重新登录并修改密码`,
                                nzFooter: [
                                    {
                                        label: '重新登录',
                                        type: 'primary',
                                        onClick: () => {
                                            modal.destroy();
                                            this.fetchService.signout();
                                        }
                                    }
                                ],
                                nzClosable: false
                            });
                        } else {
                            observer.next(true);
                        }
                        break;
                }
            });
        });
    }
}
