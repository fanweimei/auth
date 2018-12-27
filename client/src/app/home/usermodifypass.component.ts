import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpResponse } from '@angular/common/http';
import md5 from 'js-md5';
import { NzModalRef } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';

@Component({
    selector: 'usermodify-pass',
    template: `
        <form nz-form [formGroup]="vForm" (ngSubmit)="submitForm($event,vForm.value)" novalidate style="border: none;">
            <nz-form-item nzFlex>
                <nz-form-label [nzSpan]="6" nzRequired>当前密码</nz-form-label>
                <nz-form-control [nzSpan]="16" nzHasFeedback>
                    <input type="password" nz-input formControlName="password" placeholder="密码">
                    <nz-form-explain *ngIf="vForm.get('password').dirty && vForm.get('password').errors ">
                        不能为空
                    </nz-form-explain>
                </nz-form-control>
            </nz-form-item>
            <nz-form-item nzFlex>
                <nz-form-label [nzSpan]="6" nzRequired>新密码</nz-form-label>
                <nz-form-control [nzSpan]="16" nzHasFeedback>
                    <input type="password" nz-input formControlName="newpass" placeholder="新密码">
                    <nz-form-explain *ngIf="vForm.get('newpass').dirty && vForm.get('newpass').errors ">
                        不能为空
                    </nz-form-explain>
                </nz-form-control>
            </nz-form-item>
            <nz-form-item nzFlex>
                <nz-form-label [nzSpan]="6" nzRequired>确认密码</nz-form-label>
                <nz-form-control [nzSpan]="16" nzHasFeedback>
                    <input type="password" nz-input formControlName="newpass2" placeholder="确认密码">
                    <nz-form-explain *ngIf="vForm.get('newpass2').dirty && vForm.value.newpass!==vForm.value.newpass2 ">
                        密码不一致
                    </nz-form-explain>
                </nz-form-control>
            </nz-form-item>
            <nz-form-item nzFlex>
                <nz-form-control [nzSpan]="16" nzOffset="6">
                    <button nz-button nzType="primary" [disabled]="!vForm.valid || vForm.value.newpass!==vForm.value.newpass2">提交</button>
                </nz-form-control>
            </nz-form-item>
        </form>
    `
})
export class UsermodifyPassComponent implements OnInit, AfterViewInit {
    vForm: FormGroup;
    constructor(
        private fb: FormBuilder,
        private fetchService: FetchService,
        private message: NzMessageService,
        private modal: NzModalRef
    ) { }
    ngOnInit() {
        this.vForm = this.fb.group({
            password: ['', Validators.required],
            newpass: ['', Validators.required],
            newpass2: ['', Validators.required]
        });
    }
    ngAfterViewInit() {

    }
    submitForm(e, value) {
        e.stopPropagation();
        const username = localStorage.getItem('username');
        if (!username) {
            this.message.create('error', '请先登录后再修改密码')
            return;
        }
        const { password, newpass } = value;
        this.fetchService.excuteSend({
            path: 'user/modifypass',
            method: 'post',
            data: {
                username: username,
                oldpass: md5(password.trim()),
                newpass: md5(newpass.trim())
            },
            tip: {
                success: '密码修改成功'
            }
        }).subscribe(result => {
            if (result) {
                setTimeout(() => {
                    this.modal.destroy();
                }, 500);
            }
        });
    }
}