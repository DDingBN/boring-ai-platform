import { Breadcrumb as AntBreadcrumb } from 'antd';
import type { BreadcrumbProps } from 'antd';

export type LayoutBreadcrumbProps = {
    items?: BreadcrumbProps['items'];
};

const defaultBreadcrumbItems: BreadcrumbProps['items'] = [
    { title: '首页' },
    { title: '工作流' },
    { title: '工作流列表' },
];

export function LayoutBreadcrumb({ items = defaultBreadcrumbItems }: LayoutBreadcrumbProps) {
    return <AntBreadcrumb items={items} />;
}

export default LayoutBreadcrumb;
