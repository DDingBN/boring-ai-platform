import { Breadcrumb as AntBreadcrumb } from 'antd';
import type { BreadcrumbProps } from 'antd';

export type LayoutBreadcrumbProps = {
    items?: BreadcrumbProps['items'];
};

const defaultBreadcrumbItems: BreadcrumbProps['items'] = [];

export function LayoutBreadcrumb({ items = defaultBreadcrumbItems }: LayoutBreadcrumbProps) {
    return <AntBreadcrumb items={items} />;
}

export default LayoutBreadcrumb;
