import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultMenuPath } from '../../data/menuData';
import styles from './ErrorPage.module.css';

export function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Result
            className={styles.page}
            status="404"
            title="404"
            subTitle="页面不存在，或者对应的页面组件还没有在 routeRegistry 中注册。"
            extra={
                <Button type="primary" onClick={() => navigate(defaultMenuPath)}>
                    返回首页
                </Button>
            }
        />
    );
}

export default NotFoundPage;
