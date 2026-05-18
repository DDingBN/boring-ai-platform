import { Button, Card, Form, Input, Typography } from 'antd';
import styles from './Login.module.css';

export function Login() {
    return (
        <main className={styles.page}>
            <Card className={styles.card}>
                <Typography.Title level={3}>Boring AI Platform</Typography.Title>
                <Form layout="vertical">
                    <Form.Item label="账号" name="username">
                        <Input placeholder="请输入账号" />
                    </Form.Item>
                    <Form.Item label="密码" name="password">
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    <Button block htmlType="submit" type="primary">
                        登录
                    </Button>
                </Form>
            </Card>
        </main>
    );
}

export default Login;
