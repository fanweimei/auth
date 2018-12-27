import { Base64 } from 'js-base64';

export class AuthService {
    static from = '';
    static arrayToTree(dataSet) {
        const hasMap = {};
        const notRootNodes = [];
        let rootNodes = [];

        for (const item of dataSet) {
            if (!item.pid) {
                rootNodes.push(item);
            } else {
                notRootNodes.push(item);
            }
            hasMap[item.id] = item;
        }
        for (const item of notRootNodes) {
            const parent = hasMap[item.pid];
            if (parent.children) {
                parent.children.push(item);
            } else {
                parent.children = [item];
            }
        }
        const tree = this.sortMenu(rootNodes);
        return tree;
    }
    //按seq排序
    static sortMenu(nodes) {
        nodes = nodes.sort(function (item1, item2) {
            const a = item1.sequence ? +item1.sequence : 0;
            const b = item2.sequence ? +item2.sequence : 0;
            return a - b;
        });
        for (const node of nodes) {
            if (node.children && node.children.length) {
                node.children = this.sortMenu(node.children);
            }
        }
        return nodes;
    }

    // 获取顶级路由菜单
    static getHomeMenu() {
        const menu = JSON.parse(Base64.decode(localStorage.getItem('menu')) || '[]');
        const data = [];
        for (const item of menu) {
            data.push({
                name: item.name,
                routepath: AuthService.getHomeNodeRoute(item),
                icon: item.icon
            });
        }
        return data;
    }

    static getHomeNodeRoute(node) {
        if (node.routepath.startsWith('http:') || node.routepath.startsWith('https:') || (node.type !== 'module' && node.routepath)) {
            return node.routepath;
        }
        if (node.children) {
            for (const child of node.children) {
                const url = this.getHomeNodeRoute(child);
                if (url) {
                    return url;
                }
            }
        }
    }

    // 如果不包含首页获取登录后跳转的第一个页面
    static goFirstRoute() {
        const menu = JSON.parse(Base64.decode(localStorage.getItem('menu')) || '[]');
        for (const item of menu) {
            const page = AuthService._goFirstRoute(item);
            if (page) {
                return page;
            }
        }
        return '';
    }

    static _goFirstRoute(node) {
        if (node.type !== 'module' && node.routepath) {
            return node.routepath;
        }
        if (node.children) {
            for (const child of node.children) {
                return this._goFirstRoute(child);
            }
        }
    }

    static getPages(key, value) {
        const menu = JSON.parse(Base64.decode(localStorage.getItem('menu')) || '[]');
        const findPage = (node) => {
            if (node[key] === value) {
                return node;
            }
            if (node.children) {
                for (const child of node.children) {
                    findPage(child);
                }
            }
        };
        for (const item of menu) {
            const myModule = findPage(item);
            if (myModule) {
                return myModule.children && myModule.children.length ? myModule.children : [];
            }
        }
    }

    // 是否有某个功能点的权限
    static existFn(type: number) {
        const authIds = JSON.parse(Base64.decode(localStorage.getItem('authIds')) || '[]');
        return authIds.includes(type);
    }

    // 根据ID获取某个资源
    static getPageById(id) {
        return AuthService.getPages('id', id);
    }

    // 是否存在某页面
    static existPageByPath(path: string): boolean {
        const pages = JSON.parse(Base64.decode(localStorage.getItem('pages')) || '[]');
        const pathArr = path.slice(1).split('/');
        for (const page of pages) {
            if (!page) {
                continue;
            }
            if (page === path) {
                return true;
            } else if (page.includes(':')) {
                const tmp = page.slice(1).split('/');
                let i = 0, j = 0;
                while (i < tmp.length && j < pathArr.length) {
                    if (tmp[i] === pathArr[i] || tmp[i].includes(':')) {
                        i++;
                        j++;
                    } else {
                        break;
                    }
                }
                if (i === pathArr.length && j === tmp.length) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 根据Key值获取某个资源
     * @param key
     * (1)array eg ['user', 'delete']
     * (2)string eg user.delete
     */
    static getResouceByKey(key: string | Array<string>) {
        const keyArray = typeof key == 'string' ? key.split('.') : key;
        if (keyArray.length <= 0) {
            return;
        }
        let menu = JSON.parse(Base64.decode(localStorage.getItem('menu')) || '[]');
        let cur = { children: null };
        let i = 0;
        while ((menu && menu.length) && i < keyArray.length && cur) {
            cur = menu.find(item => item.key == keyArray[i]);
            menu = cur ? cur.children : null;
            i++;
        }
        return (i >= keyArray.length && cur) ? cur : null;
    }
}
