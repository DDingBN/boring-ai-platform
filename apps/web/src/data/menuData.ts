export type MenuIconName = 'home' | 'chat';

export type MenuDataItem = {
    key: string;
    label: string;
    icon?: MenuIconName;
    path?: string;
    children?: MenuDataItem[];
};

export const menuData = [
    {
        key: 'home',
        label: '首页',
        icon: 'home',
        path: '/home',
    },
    {
        key: 'chat',
        label: '我的问答',
        icon: 'chat',
        path: '/chat',
    },
] satisfies MenuDataItem[];

export const defaultMenuPath = '/home';

export function flattenMenuItems(items: MenuDataItem[] = menuData): MenuDataItem[] {
    return items.flatMap((item) => {
        if (!item.children?.length) {
            return [item];
        }

        return [item, ...flattenMenuItems(item.children)];
    });
}

export function getMenuItemByPath(pathname: string, items: MenuDataItem[] = menuData) {
    return flattenMenuItems(items).find((item) => item.path === pathname);
}

export function getMenuPathKeys(pathname: string, items: MenuDataItem[] = menuData): string[] {
    for (const item of items) {
        if (item.path === pathname) {
            return [item.key];
        }

        if (item.children?.length) {
            const childKeys = getMenuPathKeys(pathname, item.children);

            if (childKeys.length > 0) {
                return [item.key, ...childKeys];
            }
        }
    }

    return [];
}

export function getBreadcrumbItems(pathname: string, items: MenuDataItem[] = menuData) {
    const menuPathKeys = getMenuPathKeys(pathname, items);
    const breadcrumbItems = [];

    let currentItems = items;

    for (const key of menuPathKeys) {
        const item = currentItems.find((menuItem) => menuItem.key === key);

        if (!item) {
            break;
        }

        breadcrumbItems.push({ title: item.label });
        currentItems = item.children ?? [];
    }

    return breadcrumbItems;
}

export function getMenuLeafItems(items: MenuDataItem[] = menuData): MenuDataItem[] {
    return flattenMenuItems(items).filter((item) => Boolean(item.path));
}
