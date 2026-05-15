import { Avatar, Button, Layout, Space, Typography } from 'antd';

const { Header: AntHeader } = Layout;

export type LayoutHeaderProps = {
    collapsed?: boolean;
    title?: string;
    onToggleSider?: () => void;
};

export function LayoutHeader({
    collapsed = false,
    title = '工作台',
    onToggleSider,
}: LayoutHeaderProps) {
    return (
        <AntHeader className="layout-header">
            <Space align="center" size={16}>
                <Button onClick={onToggleSider} type="text">
                    {collapsed ? '展开' : '收起'}
                </Button>
                <Typography.Title level={4} style={{ margin: 0 }}>
                    {title}
                </Typography.Title>
            </Space>
            <Space align="center" size={12}>
                <Typography.Text type="secondary">管理员</Typography.Text>
                <Avatar>AI</Avatar>
            </Space>
        </AntHeader>
    );
}

export default LayoutHeader;
