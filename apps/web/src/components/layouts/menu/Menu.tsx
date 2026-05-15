import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';
import { createSubMenu, type LayoutMenuItem } from './SubMenu';

export const layoutMenuItems: LayoutMenuItem[] = [
    createSubMenu({
        key: 'workflow',
        label: '工作流',
        children: [
            { key: 'workflow-list', label: '工作流列表' },
            { key: 'workflow-create', label: '新建工作流' },
        ],
    }),
    createSubMenu({
        key: 'knowledge',
        label: '知识库',
        children: [
            { key: 'datasets', label: '数据集' },
            { key: 'documents', label: '文档管理' },
        ],
    }),
    createSubMenu({
        key: 'settings',
        label: '系统设置',
        children: [
            { key: 'members', label: '成员管理' },
            { key: 'models', label: '模型配置' },
        ],
    }),
];

export type LayoutMenuProps = {
    items?: LayoutMenuItem[];
    mode?: MenuProps['mode'];
    selectedKey?: string;
    theme?: MenuProps['theme'];
    onSelect?: MenuProps['onSelect'];
};

export function LayoutMenu({
    items = layoutMenuItems,
    mode = 'inline',
    selectedKey = 'workflow-list',
    theme = 'light',
    onSelect,
}: LayoutMenuProps) {
    return (
        <AntMenu
            items={items}
            mode={mode}
            onSelect={onSelect}
            selectedKeys={selectedKey ? [selectedKey] : []}
            style={{ borderInlineEnd: 0 }}
            theme={theme}
        />
    );
}

export default LayoutMenu;
