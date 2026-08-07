export const routeMeta = {
    '/403': {
        title: '403',
        breadcrumbItems: [{ title: '首页' }, { title: '403' }],
    },
    '/404': {
        title: '404',
        breadcrumbItems: [{ title: '首页' }, { title: '404' }],
    },
    '/500': {
        title: '500',
        breadcrumbItems: [{ title: '首页' }, { title: '500' }],
    },
};

export function getRouteMeta(pathname) {
    return routeMeta[pathname];
}
