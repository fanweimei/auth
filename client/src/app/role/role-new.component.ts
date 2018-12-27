import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';

@Component({
    selector: 'role-new',
    template: `
        <form nz-form [formGroup]="validateForm" novalidate (ngSubmit)="submitForm($event,validateForm.value)" style="border: none;">
            <nz-form-item>
                <nz-form-label [nzSpan]="7" nzRequired>角色名</nz-form-label>
                <nz-form-control [nzSpan]="12" nzHasFeedback>
                    <input nz-input formControlName="name" placeholder="角色名">
                    <nz-form-explain *ngIf="validateForm.get('name').dirty && validateForm.get('name').errors ">
                        <ng-container *ngIf="validateForm.get('name').hasError('required')">
                            这是必填字段
                        </ng-container>
                        <ng-container *ngIf="validateForm.get('name').hasError('duplicated')">
                            该角色名已存在
                        </ng-container>
                    </nz-form-explain>
                </nz-form-control>
            </nz-form-item>
            <nz-form-item>
                <nz-form-control [nzOffset]="7" [nzSpan]="12">
                    <button nz-button nzType="primary" [disabled]="!validateForm.valid">提交</button>
                </nz-form-control>
            </nz-form-item>
        </form>
    `
})
export class RoleNewComponent implements OnInit {
    validateForm: FormGroup;
    id: string | number;
    @Input() source;

    constructor(
        private fetchService: FetchService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalRef
    ) { }

    ngOnInit() {
        if (this.source) {
            this.id = this.source.id;
            this.validateForm = this.fb.group({
                name: [this.source.name, [Validators.required], [this.userNameAsyncValidator]]
            });
        } else {
            this.id = '';
            this.validateForm = this.fb.group({
                name: ['', [Validators.required], [this.userNameAsyncValidator]]
            });
        }
    }

    userNameAsyncValidator = (control: FormControl) => {
        const data = {
            field: 'name',
            value: control.value,
            id: this.id
        };
        return this.uniqueCheck('role/unique', data);
    }

    uniqueCheck(path, data) {
        return Observable.create((observer: Observer<ValidationErrors>) => {
            this.fetchService.excuteSend({
                path: path,
                data: data,
                method: 'post',
                isLoading: false
            }).subscribe(result => {
                if (result) {
                    observer.next(null);
                } else {
                    observer.next({ error: true, duplicated: true });
                }
                observer.complete();
            });
        });
    }

    submitForm = ($event, form) => {
        $event.preventDefault();
        const data = {
            name: form.name
        };
        this.fetchService.excuteSend({
            method: this.source ? 'put' : 'post',
            path: this.source ? 'role/' + this.source.id : 'role',
            data: data,
            tip: {
                success: `${this.source ? '修改' : '添加'}成功`
            }
        }).subscribe(result => {
            if (result) {
                setTimeout(() => {
                    this.modal.destroy(true);
                }, 500);
            }
        });
    }

}
