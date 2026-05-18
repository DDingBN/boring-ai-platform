import type { ReactNode } from 'react';
import { Layout } from 'antd';

const { Content: AntContent } = Layout;

export type LayoutContentProps = {
    children?: ReactNode;
};

export function LayoutContent({ children }: LayoutContentProps) {
    return <AntContent className="layout-content">{children}</AntContent>;
}

export default LayoutContent;
