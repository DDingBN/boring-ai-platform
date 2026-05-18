import type { ComponentType } from 'react';
import { ChatPage } from '../pages/chat/ChatPage';
import { Home } from '../pages/home/Home';
import type { MenuDataItem } from './menuData';

export type MenuRoutePageProps = {
    menuItem: MenuDataItem;
};

export type MenuRouteComponent = ComponentType<MenuRoutePageProps>;

export const routeRegistry: Partial<Record<string, MenuRouteComponent>> = {
    '/home': Home,
    '/chat': ChatPage,
};

export function getRouteComponent(path: string) {
    return routeRegistry[path];
}
