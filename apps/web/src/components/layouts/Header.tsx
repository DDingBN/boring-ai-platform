import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Button, Layout, Space, Typography } from 'antd';
import type { BreadcrumbProps } from 'antd';
import { LayoutBreadcrumb } from './Breadcrumb';

const { Header: AntHeader } = Layout;

export type LayoutHeaderProps = {
    breadcrumbItems?: BreadcrumbProps['items'];
    collapsed?: boolean;
    title?: string;
    onToggleSider?: () => void;
};

export function LayoutHeader({
    breadcrumbItems,
    collapsed = false,
    onToggleSider,
}: LayoutHeaderProps) {
    return (
        <AntHeader className="layout-header">
            <Space align="center" size={16}>
                <Button
                    aria-label={collapsed ? '展开菜单栏' : '收起菜单栏'}
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onToggleSider}
                    type="text"
                />
                <LayoutBreadcrumb items={breadcrumbItems} />
            </Space>
            <Space align="center" size={12}>
                <Typography.Text type="secondary">管理员</Typography.Text>
                <Avatar>AI</Avatar>
            </Space>
        </AntHeader>
    );
}

export default LayoutHeader;
