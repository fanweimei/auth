import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

/**
 * 因为面包屑的获取不能再Layout组件上进行
 * 获取面包屑只能设置在主页
 */

@Injectable()
export class RouterService {
    // 当前面包屑
    public breadcrumbs = [];
    // 当前路径
    public url = '/';

    init() {
        this.breadcrumbs = [];
        this.url = '/';
    }
    getBreadcrumbs(route: ActivatedRouteSnapshot) {
        if (!route.data || !route.data.breadcrumb) {
            if (route.children.length > 0) {
                this.getBreadcrumbs(route.children[0]);
            }
            return;
        }
        const { isLink, parent, label } = route.data.breadcrumb;
        if (parent) {
            for (const p of parent) {
                this.breadcrumbs.push({
                    label: p.label,
                    params: p.params || {},
                    url: p.url ? `${this.url}${p.url}` : ''
                });
            }
        }
        this.breadcrumbs.push({
            label: label,
            params: route.params,
            url: isLink ? this.url : ''
        });
        const path = route.url.map(segment => segment.path).join('/');
        this.url += path;
        if (route.children.length > 0 && path) {
            this.url += '/';
        }
        if (route.children.length > 0) {
            this.getBreadcrumbs(route.children[0]);
        }
    }
}