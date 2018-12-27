
export enum MenuType {
    Module = 'module',
    Page = 'page',
    Fn = 'fn'
}
export interface MenuNode {
    id: string;
    name: string;
    type: MenuType;
    sequence?: number;
    icon?: string;
    routepath?: string;
    modulepath?: string;
    classname?: string;
    children?: MenuNode[];
    level: number;
    expand: boolean;
    parent?: any;
}