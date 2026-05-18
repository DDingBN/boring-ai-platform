import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { menuData } from '../../../data/menuData';
import { createMenuItem, type LayoutMenuItem } from './SubMenu';

export const layoutMenuItems = menuData.map(createMenuItem);

export type LayoutMenuProps = {
    items?: LayoutMenuItem[];
    collapsed?: boolean;
    defaultOpenKeys?: string[];
    mode?: MenuProps['mode'];
    selectedKey?: string;
    theme?: MenuProps['theme'];
    onSelect?: MenuProps['onSelect'];
};

export function LayoutMenu({
    items = layoutMenuItems,
    collapsed = false,
    defaultOpenKeys,
    mode = 'inline',
    selectedKey,
    theme = 'light',
    onSelect,
}: LayoutMenuProps) {
    return (
        <AntMenu
            items={items}
            mode={mode}
            onSelect={onSelect}
            defaultOpenKeys={defaultOpenKeys}
            inlineCollapsed={mode === 'inline' ? collapsed : undefined}
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{ borderInlineEnd: 0 }}
            theme={theme}
        />
    );
}

export default LayoutMenu;
