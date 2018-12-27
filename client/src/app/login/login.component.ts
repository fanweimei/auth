import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Base64 } from 'js-base64';
import md5 from 'js-md5';
import { NzMessageService } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';
import { AuthService } from '../core/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;

  constructor(
    private router: Router,
    private fetchService: FetchService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  submitForm(e, value) {
    e.stopPropagation();
    this.fetchService.excuteSend({
      path: 'user/login',
      method: 'post',
      data: {
        username: value.username,
        password: md5(value.password)
      },
      allreturn: true
    }).subscribe((data: HttpResponse<any>) => {
      const { code, result } = data.body;
      if (code == 0) {
        const menu = result.menu;
        localStorage.setItem('username', value.username);
        localStorage.setItem('userId', result.user ? result.user.id : '')
        const menuTree = AuthService.arrayToTree(menu);
        localStorage.setItem('menu', Base64.encode(JSON.stringify(menuTree || [])));
        const authIds = result.menu.map(item => item.id);
        localStorage.setItem('authIds', Base64.encode(JSON.stringify(authIds || [])));
        let pages = result.menu.map(item => item.routepath).filter(item => item);
        localStorage.setItem('pages', Base64.encode(JSON.stringify(pages || [])));
        let url = '/index';
        if (!AuthService.existPageByPath(url)) {
          url = AuthService.goFirstRoute();
        }
        this.router.navigate([url]);
      } else if (code === -1) {
        this.message.create('error', '用户或密码不正确');
      } else {
        this.message.create('error', '该用户不可以登录');
      }
    });
  }
}
