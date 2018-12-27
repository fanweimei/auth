const IP = 'http://127.0.0.1:7001/';

export default {
    IP,
    ADMIN: { // 超级管理员用户，不需要先添加用户即可登录
        username: 'SUPER',
        password: 'SUPER-123456'
    },
    MENUS: {
        USER: {
            key: 'user',
            children: {
                EDIT: {
                    key: 'edit'
                },
                DELETE: {
                    key: 'delete'
                }
            }
        },
        ROLE: {
            key: 'role',
            children: {
                SETUSER: {
                    key: 'setuser'
                },
                SETAUTH: {
                    key: 'setauth'
                },
                EDIT: {
                    key: 'edit'
                },
                DELETE: {
                    key: 'delete'
                }
            }
        },
        MENU: {
            key: 'menu',
            children: {
                EDIT: {
                    key: 'edit'
                },
                DELETE: {
                    key: 'delete'
                }
            }
        }
    }
}