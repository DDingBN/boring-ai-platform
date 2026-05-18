import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layouts/Main';
import { defaultMenuPath, getMenuLeafItems } from '../data/menuData';
import { getRouteComponent } from '../data/routeRegistry';
import { ForbiddenPage } from '../pages/error/403';
import { NotFoundPage } from '../pages/error/404';
import { ServerErrorPage } from '../pages/error/500';
import { Login } from '../pages/login/Login';

function toRoutePath(path: string) {
    return path.replace(/^\//, '');
}

export const dynamicRoutes: RouteObject[] = getMenuLeafItems().map((menuItem) => {
    const path = menuItem.path ?? '';
    const RouteComponent = getRouteComponent(path);

    return {
        path: toRoutePath(path),
        element: RouteComponent ? <RouteComponent menuItem={menuItem} /> : <NotFoundPage />,
    };
});

export const staticRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <Login />,
    },
];

export const errorRoutes: RouteObject[] = [
    {
        path: '403',
        element: <ForbiddenPage />,
    },
    {
        path: '404',
        element: <NotFoundPage />,
    },
    {
        path: '500',
        element: <ServerErrorPage />,
    },
];

export const routes: RouteObject[] = [
    ...staticRoutes,
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate replace to={defaultMenuPath} />,
            },
            ...dynamicRoutes,
            ...errorRoutes,
            {
                path: '*',
                element: <NotFoundPage />,
            },
        ],
    },
];
