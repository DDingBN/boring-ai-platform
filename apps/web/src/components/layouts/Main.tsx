import { Layout } from 'antd';
import type { MenuProps } from 'antd';
import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    defaultMenuPath,
    getBreadcrumbItems,
    getMenuItemByPath,
    getMenuPathKeys,
} from '../../data/menuData';
import { getRouteMeta } from '../../data/routeMeta';

import { LayoutContent } from './Content';
import { LayoutFooter } from './Footer';
import { LayoutHeader } from './Header';
import { LayoutSider } from './Sider';

export function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const activeMenuItem = getMenuItemByPath(location.pathname);
    const activeRouteMeta = getRouteMeta(location.pathname);
    const activePath = activeMenuItem?.path ?? defaultMenuPath;
    const activeMenuKeys = useMemo(() => getMenuPathKeys(activePath), [activePath]);
    const breadcrumbItems = useMemo(() => {
        if (activeMenuItem) {
            return getBreadcrumbItems(activePath);
        }

        return activeRouteMeta?.breadcrumbItems ?? [{ title: '首页' }, { title: '页面不存在' }];
    }, [activeRouteMeta, activeMenuItem, activePath]);
    const title = activeMenuItem?.label ?? activeRouteMeta?.title ?? '页面不存在';

    const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
        navigate(String(key));
    };

    return (
        <Layout className="app-layout">
            <LayoutSider
                collapsed={collapsed}
                defaultOpenKeys={activeMenuItem ? activeMenuKeys.slice(0, -1) : []}
                onCollapse={setCollapsed}
                onMenuSelect={handleMenuSelect}
                selectedKey={activeMenuItem ? activePath : undefined}
            />
            <Layout className="app-layout__body">
                <LayoutHeader
                    breadcrumbItems={breadcrumbItems}
                    collapsed={collapsed}
                    onToggleSider={() => setCollapsed((value) => !value)}
                    title={title}
                />
                <main className="app-layout__main">
                    <LayoutContent>
                        <Outlet />
                    </LayoutContent>
                </main>
                <LayoutFooter />
            </Layout>
        </Layout>
    );
}

export default MainLayout;
