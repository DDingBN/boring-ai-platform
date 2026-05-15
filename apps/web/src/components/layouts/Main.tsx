import { Layout } from 'antd';
import { useMemo, useState } from 'react';
import type { MenuProps } from 'antd';
import { LayoutBreadcrumb } from './Breadcrumb';
import { LayoutContent } from './Content';
import { LayoutFooter } from './Footer';
import { LayoutHeader } from './Header';
import { LayoutSider } from './Sider';

const menuTitles: Record<string, string> = {
    'workflow-list': '工作流列表',
    'workflow-create': '新建工作流',
    datasets: '数据集',
    documents: '文档管理',
    members: '成员管理',
    models: '模型配置',
};

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('workflow-list');

    const title = menuTitles[selectedKey] ?? '工作台';
    const breadcrumbItems = useMemo(() => [{ title: '首页' }, { title }], [title]);

    const handleMenuSelect: MenuProps['onSelect'] = ({ key }) => {
        setSelectedKey(String(key));
    };

    return (
        <Layout className="app-layout">
            <LayoutSider
                collapsed={collapsed}
                onCollapse={setCollapsed}
                onMenuSelect={handleMenuSelect}
                selectedKey={selectedKey}
            />
            <Layout>
                <LayoutHeader
                    collapsed={collapsed}
                    onToggleSider={() => setCollapsed((value) => !value)}
                    title={title}
                />
                <main className="app-layout__main">
                    <LayoutBreadcrumb items={breadcrumbItems} />
                    <LayoutContent title={title} />
                </main>
                <LayoutFooter />
            </Layout>
        </Layout>
    );
}

export default MainLayout;
