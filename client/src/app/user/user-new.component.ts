import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { format } from 'date-fns';
import md5 from 'js-md5';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { FetchService } from '../core/fetch.service';

@Component({
    selector: 'user-new',
    templateUrl: './user-new.component.html',
    styles: [`
        .g-user-new {
            margin: 50px auto;
            width: 400px;
        }
        nz-form-label {
            width: 20%;
        }
        nz-form-control {
            width: 80%;
        }
    `]
})
export class UserNewComponent implements OnInit {
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
                username: [this.source.username || '', [Validators.required], [this.userNameAsyncValidator]],
                realname: [this.source.realname || ''],
                status: [this.source.status ? true : false || ''],
                dateRange: [this.source.startDate && this.source.endDate ? [new Date(this.source.startDate), new Date(this.source.endDate)] : []]
            });
        } else {
            this.id = '';
            this.validateForm = this.fb.group({
                username: ['', [Validators.required], [this.userNameAsyncValidator]],
                realname: '',
                status: [true],
                dateRange: [[]]
            });
        }
    }

    userNameAsyncValidator = (control: FormControl) => {
        const data = {
            field: 'username',
            value: control.value,
            id: this.id
        };
        return this.uniqueCheck('user/unique', data);
    }

    emailAsyncValidator = (control: FormControl) => {
        const data = {
            field: 'email',
            value: control.value,
            id: this.id
        };
        return this.uniqueCheck('user/unique', data);
    }

    uniqueCheck(path, data) {
        return Observable.create((observer: Observer<ValidationErrors>) => {
            this.fetchService.excuteSend({
                path: path,
                data: data,
                method: 'post',
                isLoading: false,
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

    submitForm($event, form) {
        $event.preventDefault();
        const data = {
            username: form.username,
            password: md5('123456'),
            status: form.status ? 1 : 0
        };
        if (form.realname) {
            data['realname'] = form.realname;
        }
        if (form.dateRange && form.dateRange.length > 1) {
            data['startDate'] = format(form.dateRange[0], 'YYYY-MM-DD');
            data['endDate'] = format(form.dateRange[1], 'YYYY-MM-DD');
        }
        this.fetchService.excuteSend({
            path: this.id ? 'user/' + this.id : 'user',
            method: this.id ? 'put' : 'post',
            data: data,
            tip: {
                success: `${this.id ? '修改' : '添加'}成功`
            }
        }).subscribe(result => {
            if (result) {
                setTimeout(() => {
                    this.modal.destroy(true);
                }, 500);
            }
        });
    }

    resetForm(e: MouseEvent): void {
        e.preventDefault();
        this.validateForm.reset();
    }

}
