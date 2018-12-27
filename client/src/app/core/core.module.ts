import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterService } from './router.service';
import { FetchService } from './fetch.service';
import { AuthGuardService } from './auth-guard.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        RouterService,
        FetchService,
        AuthGuardService
        // { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
    ],
})
export class CoreModule { }
