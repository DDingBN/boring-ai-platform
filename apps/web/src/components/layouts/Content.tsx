import { Card, Col, Layout, Row, Statistic, Table, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Content: AntContent } = Layout;

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => <Tag color="processing">{status}</Tag>,
    },
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },
];

const dataSource = [
    {
        key: '1',
        name: '内容生成流程',
        status: '运行中',
        updatedAt: '今天 10:24',
    },
    {
        key: '2',
        name: '知识库同步',
        status: '待发布',
        updatedAt: '昨天 18:10',
    },
];

export type LayoutContentProps = {
    children?: ReactNode;
    title?: string;
};

export function LayoutContent({ children, title = '工作台' }: LayoutContentProps) {
    return (
        <AntContent className="layout-content">
            {children ?? <SpacePlaceholder title={title} />}
        </AntContent>
    );
}

function SpacePlaceholder({ title }: { title: string }) {
    return (
        <div className="layout-content__inner">
            <Typography.Title level={3}>{title}概览</Typography.Title>
            <Row gutter={[16, 16]}>
                <Col lg={8} md={12} xs={24}>
                    <Card>
                        <Statistic title="工作流总数" value={18} />
                    </Card>
                </Col>
                <Col lg={8} md={12} xs={24}>
                    <Card>
                        <Statistic title="今日运行" value={126} />
                    </Card>
                </Col>
                <Col lg={8} md={12} xs={24}>
                    <Card>
                        <Statistic title="成功率" suffix="%" value={98.6} />
                    </Card>
                </Col>
            </Row>
            <Card title="最近工作流">
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </Card>
        </div>
    );
}

export default LayoutContent;
