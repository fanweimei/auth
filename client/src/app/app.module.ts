import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData, LocationStrategy, HashLocationStrategy } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HomeComponent } from './home/home.component';
import { CoreModule } from './core/core.module';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { RoleComponent } from './role/role.component';
import { DealTablePipe } from './deal-table.pipe';
import { UserNewComponent } from './user/user-new.component';
import { RoleNewComponent } from './role/role-new.component';
import { MenuNewComponent } from './menu/menu-new.component';
import { RoleAddAuthComponent } from './role/role-add-auth.component';
import { RoleAddUserComponent } from './role/role-add-user.component';
import { LoginComponent } from './login/login.component';
import { UsermodifyPassComponent } from './home/usermodifypass.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    MenuComponent,
    RoleComponent,
    UserNewComponent,
    MenuNewComponent,
    RoleAddAuthComponent,
    RoleAddUserComponent,
    RoleNewComponent,
    DealTablePipe,
    LoginComponent,
    UsermodifyPassComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    UserNewComponent,
    RoleNewComponent,
    MenuNewComponent,
    RoleAddUserComponent,
    UsermodifyPassComponent
  ]
})
export class AppModule { }
