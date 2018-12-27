import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { RoleAddAuthComponent } from './role/role-add-auth.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './core/auth-guard.service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuardService],
        data: {
          breadcrumb: {
            label: '主页'
          }
        },
        children: [
          {
            path: 'user',
            component: UserComponent,
            data: {
              breadcrumb: {
                label: '用户管理'
              }
            }
          },
          {
            path: 'role',
            component: RoleComponent,
            data: {
              breadcrumb: {
                label: '角色管理'
              }
            }
          },
          {
            path: 'menu',
            component: MenuComponent,
            data: {
              breadcrumb: {
                label: '菜单管理'
              }
            }
          },
          {
            path: 'role-add-auth/:id/:name',
            component: RoleAddAuthComponent,
            data: {
              breadcrumb: {
                label: '设置权限',
                parent: [
                  {
                    label: '角色管理',
                    isLink: true,
                    url: 'role'
                  }
                ]
              }
            }
          },
        ]
      }

    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
