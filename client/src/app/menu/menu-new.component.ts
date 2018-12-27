import { Component, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { MenuType } from './interface';
import { FetchService } from '../core/fetch.service';
import { Observable, Observer } from 'rxjs';

@Component({
    selector: 'menu-new',
    templateUrl: './menu-new.component.html'
})
export class MenuNewComponent implements OnInit {
    @Input() type;
    @Input() source;
    @Input() pid;
    @Input() sameDirAllKeys;
    vForm: FormGroup;

    constructor(
        private fetchService: FetchService,
        private fb: FormBuilder,
        private message: NzMessageService,
        private modal: NzModalRef
    ) { }

    ngOnInit() {
        if (this.source) {
            this.vForm = this.fb.group({
                name: [this.source.name, [Validators.required]],
                icon: [this.source.icon],
                sequence: [this.source.sequence],
                routepath: [this.source.routepath],
                key: [this.source.key, [Validators.required], [this.keySameValidator]],
                remark: [this.source.remark]
            });
        } else {
            this.vForm = this.fb.group({
                name: ['', [Validators.required]],
                key: ['', [Validators.required], [this.keySameValidator]],
                icon: [''],
                sequence: [''],
                routepath: [''],
                remark: ['']
            });
        }
    }
    // 是否存在相同的key值校验
    keySameValidator = (control: FormControl) => {
        return Observable.create((observer: Observer<ValidationErrors>) => {
            if (this.sameDirAllKeys.length && control.value && this.sameDirAllKeys.includes(control.value.trim())) {
                observer.next({ error: true, sameKey: true });
            } else {
                observer.next(null);
            }
            observer.complete();
        });
    }

    submitForm(e, value) {
        e.stopPropagation();
        const data = {
            name: value.name,
            type: this.type,
            key: value.key,
            icon: value.icon || '',
            sequence: value.sequence ? +value.sequence : 0,
            routepath: value.routepath || '',
            remark: value.remark || ''
        };
        if (this.source) {
            data['pid'] = this.source.pid;
            this.fetchService.excuteSend({
                path: 'menu/' + this.source.id,
                method: 'put',
                data: data
            }).subscribe(result => {
                if (result) {
                    this.modal.destroy(data);
                }
            });
        } else {
            data['pid'] = this.pid;
            this.fetchService.excuteSend({
                path: 'menu',
                method: 'post',
                data: data,
                tip: {
                    success: '添加成功'
                }
            }).subscribe(result => {
                if (result) {
                    this.modal.destroy(result);
                }
            });
        }

    }
}
