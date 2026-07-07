import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo } from 'react';
import { menuData } from '../../../data/menuData';
import {
    createLayoutMenuItems,
    type CreateLayoutMenuItemsOptions,
    type LayoutMenuItem,
} from './menuItems';

export type LayoutMenuProps = CreateLayoutMenuItemsOptions & {
    items?: LayoutMenuItem[];
    collapsed?: boolean;
    mode?: MenuProps['mode'];
    openKeys?: string[];
    selectedKey?: string;
    theme?: MenuProps['theme'];
    onOpenChange?: MenuProps['onOpenChange'];
    onSelect?: MenuProps['onSelect'];
};

export function LayoutMenu({
    hasPermission,
    items,
    collapsed = false,
    mode = 'inline',
    openKeys,
    selectedKey,
    theme = 'light',
    onOpenChange,
    onSelect,
}: LayoutMenuProps) {
    const menuItems = useMemo(
        () => items ?? createLayoutMenuItems(menuData, { hasPermission }),
        [hasPermission, items],
    );

    return (
        <AntMenu
            items={menuItems}
            mode={mode}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            inlineCollapsed={mode === 'inline' ? collapsed : undefined}
            openKeys={mode === 'inline' ? openKeys : undefined}
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{ borderInlineEnd: 0 }}
            theme={theme}
        />
    );
}

export default LayoutMenu;
