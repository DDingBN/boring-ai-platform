import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;

export function LayoutFooter() {
    return (
        <AntFooter className="layout-footer">
            <Typography.Text type="secondary">Boring AI Platform © 2026</Typography.Text>
        </AntFooter>
    );
}

export default LayoutFooter;
