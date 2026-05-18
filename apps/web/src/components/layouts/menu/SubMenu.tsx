import { HomeOutlined, MessageOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';
import type { MenuDataItem } from '../../../data/menuData';

export type LayoutMenuItem = NonNullable<MenuProps['items']>[number];

export type LayoutSubMenuProps = MenuDataItem & {
    children: MenuDataItem[];
};

const menuIconMap: Record<NonNullable<MenuDataItem['icon']>, ReactNode> = {
    chat: <MessageOutlined />,
    home: <HomeOutlined />,
};

function getMenuIcon(icon?: MenuDataItem['icon']) {
    return icon ? menuIconMap[icon] : undefined;
}

export function createSubMenu({ key, label, icon, children }: LayoutSubMenuProps): LayoutMenuItem {
    return {
        key,
        icon: getMenuIcon(icon),
        label,
        children: children.map(createMenuItem),
    };
}

export function createMenuItem(item: MenuDataItem): LayoutMenuItem {
    if (item.children?.length) {
        return createSubMenu({
            ...item,
            children: item.children,
        });
    }

    return {
        key: item.path ?? item.key,
        icon: getMenuIcon(item.icon),
        label: item.label,
    };
}

export default createSubMenu;
