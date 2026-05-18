import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultMenuPath } from '../../data/menuData';
import styles from './ErrorPage.module.css';

export function ServerErrorPage() {
    const navigate = useNavigate();

    return (
        <Result
            className={styles.page}
            status="500"
            title="500"
            subTitle="服务器发生错误，请稍后再试。"
            extra={
                <Button type="primary" onClick={() => navigate(defaultMenuPath)}>
                    返回首页
                </Button>
            }
        />
    );
}

export default ServerErrorPage;
