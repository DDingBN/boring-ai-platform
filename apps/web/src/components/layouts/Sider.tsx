import { Layout, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { LayoutMenu } from './menu/Menu';

const { Sider: AntSider } = Layout;

export type LayoutSiderProps = {
    collapsed?: boolean;
    selectedKey?: string;
    onCollapse?: (collapsed: boolean) => void;
    onMenuSelect?: MenuProps['onSelect'];
};

export function LayoutSider({
    collapsed = false,
    selectedKey,
    onCollapse,
    onMenuSelect,
}: LayoutSiderProps) {
    return (
        <AntSider
            breakpoint="lg"
            collapsed={collapsed}
            collapsedWidth={72}
            collapsible
            onCollapse={onCollapse}
            theme="light"
            width={248}
        >
            <div className="layout-sider__brand">
                <div className="layout-sider__mark">BA</div>
                {!collapsed && (
                    <Typography.Text className="layout-sider__title" strong>
                        Boring AI
                    </Typography.Text>
                )}
            </div>
            <LayoutMenu onSelect={onMenuSelect} selectedKey={selectedKey} />
        </AntSider>
    );
}

export default LayoutSider;
