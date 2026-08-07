import { HomeOutlined, MessageOutlined } from '@ant-design/icons-vue';
import { h } from 'vue';
import { menuData } from '../../../data/menuData.js';

const menuIconMap = {
    chat: MessageOutlined,
    home: HomeOutlined,
};

function getMenuIcon(icon) {
    return icon && menuIconMap[icon] ? h(menuIconMap[icon]) : undefined;
}

function hasMenuItemAccess(item, options) {
    const requiredPermissions = item.requiredPermissions ?? [];

    if (requiredPermissions.length === 0) {
        return true;
    }

    if (!options.hasPermission) {
        return false;
    }

    return requiredPermissions.every((permission) => options.hasPermission(permission, item));
}

function createLayoutMenuItem(item, options) {
    if (!hasMenuItemAccess(item, options)) {
        return null;
    }

    if (item.children?.length) {
        const children = item.children
            .map((child) => createLayoutMenuItem(child, options))
            .filter(Boolean);

        if (children.length === 0) {
            return null;
        }

        return {
            key: item.key,
            icon: getMenuIcon(item.icon),
            label: item.label,
            children,
        };
    }

    return {
        key: item.path ?? item.key,
        icon: getMenuIcon(item.icon),
        label: item.label,
    };
}

export function createLayoutMenuItems(items = menuData, options = {}) {
    return items.map((item) => createLayoutMenuItem(item, options)).filter(Boolean);
}
