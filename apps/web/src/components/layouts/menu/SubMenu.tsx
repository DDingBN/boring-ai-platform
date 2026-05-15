import type { MenuProps } from 'antd';

export type LayoutMenuItem = NonNullable<MenuProps['items']>[number];

export type LayoutSubMenuProps = {
    key: string;
    label: string;
    children: LayoutMenuItem[];
};

export function createSubMenu({ key, label, children }: LayoutSubMenuProps): LayoutMenuItem {
    return {
        key,
        label,
        children,
    };
}

export default createSubMenu;
