import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { menuData, type MenuDataItem } from '../../../data/menuData';

export type LayoutMenuItem = NonNullable<MenuProps['items']>[number];

export type MenuPermissionChecker = (permission: string, item: MenuDataItem) => boolean;

export type CreateLayoutMenuItemsOptions = {
    hasPermission?: MenuPermissionChecker;
};

const menuIconMap: Record<NonNullable<MenuDataItem['icon']>, ReactNode> = {
    chat: <MessageOutlined />,
    home: <HomeOutlined />,
};

function getMenuIcon(icon?: MenuDataItem['icon']) {
    return icon ? menuIconMap[icon] : undefined;
}

function hasMenuItemAccess(item: MenuDataItem, options: CreateLayoutMenuItemsOptions) {
    const requiredPermissions = item.requiredPermissions ?? [];

    if (requiredPermissions.length === 0) {
        return true;
    }

    if (!options.hasPermission) {
        return false;
    }

    return requiredPermissions.every((permission) => options.hasPermission?.(permission, item));
}

function createLayoutMenuItem(
    item: MenuDataItem,
    options: CreateLayoutMenuItemsOptions,
): LayoutMenuItem | null {
    if (!hasMenuItemAccess(item, options)) {
        return null;
    }

    if (item.children?.length) {
        const children = item.children
            .map((child) => createLayoutMenuItem(child, options))
            .filter((child): child is LayoutMenuItem => Boolean(child));

        if (children.length === 0) {
            return null;
        }

        return {
            key: item.key,
            icon: getMenuIcon(item.icon),
            label: item.label,
            children,
        };
    }

    return {
        key: item.path ?? item.key,
        icon: getMenuIcon(item.icon),
        label: item.label,
    };
}

export function createLayoutMenuItems(
    items: MenuDataItem[] = menuData,
    options: CreateLayoutMenuItemsOptions = {},
) {
    return items
        .map((item) => createLayoutMenuItem(item, options))
        .filter((item): item is LayoutMenuItem => Boolean(item));
}
