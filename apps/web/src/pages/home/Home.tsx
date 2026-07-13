import { Button, Card, Col, Row, Space, Statistic, Tag, Timeline, Typography } from 'antd';
import styles from './Home.module.css';

export function Home() {
    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <Space orientation="vertical" size={12}>
                    <Tag color="blue">Boring AI Platform</Tag>
                    <Typography.Title level={2}>开始构建你的 AI 工作台</Typography.Title>
                    <Typography.Paragraph type="secondary">
                        这里是首页占位，用于承载项目概览、最近任务、快捷入口和系统状态。
                    </Typography.Paragraph>
                </Space>
                <Space>
                    <Button type="primary">新建工作流</Button>
                    <Button>查看文档</Button>
                </Space>
            </section>

            <Row className={styles.row} gutter={[16, 16]}>
                <Col lg={6} md={12} xs={24}>
                    <Card className={styles.card}>
                        <Statistic title="工作流" value={18} />
                    </Card>
                </Col>
                <Col lg={6} md={12} xs={24}>
                    <Card className={styles.card}>
                        <Statistic title="知识库" value={6} />
                    </Card>
                </Col>
                <Col lg={6} md={12} xs={24}>
                    <Card className={styles.card}>
                        <Statistic title="今日调用" value={1260} />
                    </Card>
                </Col>
                <Col lg={6} md={12} xs={24}>
                    <Card className={styles.card}>
                        <Statistic title="成功率" suffix="%" value={98.6} />
                    </Card>
                </Col>
            </Row>

            <Row className={styles.row} gutter={[16, 16]}>
                <Col lg={14} xs={24}>
                    <Card className={styles.card} title="快捷入口">
                        <div className={styles.actions}>
                            <Button block>创建聊天助手</Button>
                            <Button block>上传知识文档</Button>
                            <Button block>配置模型服务</Button>
                            <Button block>邀请团队成员</Button>
                        </div>
                    </Card>
                </Col>
                <Col lg={10} xs={24}>
                    <Card className={styles.card} title="最近动态">
                        <Timeline
                            items={[
                                {
                                    content: '内容生成流程运行完成',
                                },
                                {
                                    content: '知识库同步任务已创建',
                                },
                                {
                                    content: '模型配置已更新',
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </main>
    );
}

export default Home;
