
module.exports = app => {
    const { STRING, INTEGER, ENUM } = app.Sequelize;
    const Menu = app.model.define('menu', {
        name: {
            type: STRING,
            allowNull: false
        },
        type: {
            type: ENUM,
            allowNull: false,
            values: ['module', 'page', 'fn'] // 模块、页面、功能点
        },
        key: {
            type: STRING,
            allowNull: false
        },
        sequence: INTEGER,
        icon: STRING,
        routepath: { // 路由路径
            type: STRING,
            defaultValue: ''
        },
        remark: { // 备注
            type: STRING,
            defaultValue: ''
        }
    }, {
            timestamps: true,
            underscored: false,
            freezeTableName: true,
            tableName: 'menu',
            comment: '菜单'
        });
    Menu.associate = function () {
        Menu.hasMany(Menu, {
            as: 'parent',
            foreignKey: {
                name: 'pid',
                allowNull: true,
                defaultValue: null,
            },
            onDelete: 'CASCADE'
        });
        Menu.belongsToMany(app.model.Role, {
            as: 'role',
            through: 'role_menu_mapping',
        });
    }
    return Menu;
}