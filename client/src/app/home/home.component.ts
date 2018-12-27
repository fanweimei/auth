import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { RouterService } from '../core/router.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { FetchService } from '../core/fetch.service';
import { UsermodifyPassComponent } from './usermodifypass.component';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  menus = [
    {
      path: '/user',
      icon: 'user',
      label: '用户管理',
      selected: false
    },
    {
      path: '/role',
      icon: 'team',
      label: '角色管理',
      selected: false
    },
    {
      path: '/menu',
      icon: 'file',
      label: '菜单管理',
      selected: false
    }
  ]
  isCollapsed = false;
  triggerTemplate = null;
  username = '';
  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  constructor(
    private routerService: RouterService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fetchService: FetchService,
    private modal: NzModalService
  ) {
    router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        // 获取面包屑只能设置在主页
        this.routerService.init();
        this.routerService.getBreadcrumbs(this.activeRoute.snapshot);
      }
    });
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }

  ngOnInit() {
    this.initModule();
    const username = localStorage.getItem('username');
    this.username = username ? username : '未登录';
  }

  initModule() {
    const array = location.hash.slice(1).split('/');
    const module = array.length > 1 ? array[1] : '';
    this.menus = this.menus.map(item => {
      if (module && item.path.startsWith(`/${module}`)) {
        return { ...item, selected: true };
      } else {
        return { ...item, selected: false };
      }
    });
  }

  get breadcrumbs() {
    const breadcrumbs = this.routerService.breadcrumbs;
    return breadcrumbs;
  }

  // 退出
  appexit() {
    this.fetchService.signout();
  }
  // 修改密码
  modifyPass() {
    this.modal.create({
      nzContent: UsermodifyPassComponent,
      nzOkText: null,
      nzCancelText: null
    });
  }

}
