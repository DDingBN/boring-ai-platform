import MainLayout from '../components/layouts/Main.vue';
import { defaultMenuPath, getMenuLeafItems } from '../data/menuData.js';
import { getRouteComponent } from '../data/routeRegistry.js';
import ForbiddenPage from '../pages/error/403.vue';
import NotFoundPage from '../pages/error/404.vue';
import ServerErrorPage from '../pages/error/500.vue';
import Login from '../pages/login/Login.vue';

function toRoutePath(path) {
    return path.replace(/^\//, '');
}

export const dynamicRoutes = getMenuLeafItems().map((menuItem) => ({
    path: toRoutePath(menuItem.path ?? ''),
    component: getRouteComponent(menuItem.path) ?? NotFoundPage,
    props: { menuItem },
}));

export const staticRoutes = [
    {
        path: '/login',
        component: Login,
    },
];

export const errorRoutes = [
    {
        path: '403',
        component: ForbiddenPage,
    },
    {
        path: '404',
        component: NotFoundPage,
    },
    {
        path: '500',
        component: ServerErrorPage,
    },
];

export const routes = [
    ...staticRoutes,
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                redirect: defaultMenuPath,
            },
            ...dynamicRoutes,
            ...errorRoutes,
            {
                path: ':pathMatch(.*)*',
                component: NotFoundPage,
            },
        ],
    },
];
