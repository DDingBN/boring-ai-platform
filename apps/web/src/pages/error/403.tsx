import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { defaultMenuPath } from '../../data/menuData';
import styles from './ErrorPage.module.css';

export function ForbiddenPage() {
    const navigate = useNavigate();

    return (
        <Result
            className={styles.page}
            status="403"
            title="403"
            subTitle="你暂时没有权限访问这个页面。"
            extra={
                <Button type="primary" onClick={() => navigate(defaultMenuPath)}>
                    返回首页
                </Button>
            }
        />
    );
}

export default ForbiddenPage;
