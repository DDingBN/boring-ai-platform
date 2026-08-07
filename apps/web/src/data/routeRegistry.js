import ChatPage from '../pages/chat/ChatPage.vue';
import Home from '../pages/home/Home.vue';

export const routeRegistry = {
    '/home': Home,
    '/chat': ChatPage,
};

export function getRouteComponent(path) {
    return routeRegistry[path];
}
