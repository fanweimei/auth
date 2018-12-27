'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('user.login', '/user/login', controller.user.login);
  router.get('user.v1.verify', '/v1/user/verify', controller.user.verify);
  router.post('user.unique', '/user/unique', controller.user.unique);
  router.post('user.modifypass', '/user/modifypass', controller.user.modifyPass);
  router.delete('user.deleteToken', '/user/token', controller.user.deleteToken);
  router.get('user.listall', '/user/listall', controller.user.listall);
  router.resources('user', '/user', controller.user);

  router.post('role.unique', '/role/unique', controller.role.unique);
  router.post('role.setusers', '/role/setusers', controller.role.setUsers);
  router.get('role.getusers', '/role/getusers', controller.role.getUsers);
  router.post('role.setmenus', '/role/setmenus', controller.role.setMenus);
  router.get('role.getmenus', '/role/getmenus', controller.role.getMenus);
  router.resources('role', '/role', controller.role);
  router.get('menu.listall', '/menu/listall', controller.menu.listall);
  router.resources('menu', '/menu', controller.menu);
};
