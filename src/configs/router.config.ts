import type { RouteRecordRaw } from "vue-router";

export default [
    {
        path: '/',
        component: () => import('../pages/dashboard/index.page.vue'),
        name: "dashboard.index",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/recent',
        component: () => import('../pages/dashboard/recent.page.vue'),
        name: "dashboard.recent",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/all-projects',
        component: () => import('../pages/dashboard/all-projects.page.vue'),
        name: "dashboard.allProjects",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/favorite',
        component: () => import('../pages/dashboard/favorite.page.vue'),
        name: "dashboard.favorite",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/trash',
        component: () => import('../pages/dashboard/trash.page.vue'),
        name: "dashboard.trash",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/community',
        component: () => import('../pages/dashboard/community.page.vue'),
        name: "dashboard.community",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/settings',
        component: () => import('../pages/dashboard/settings.page.vue'),
        name: "dashboard.settings",
        meta: {
            layout: 'dashboard'
        }
    },
    {
        path: '/editor',
        component: () => import('../pages/engine/index.page.vue'),
        name: "engine.index",
        meta: {
            layout: 'engine'
        }
    },
    {
        path: '/code',
        component: () => import('../pages/engine/code.page.vue'),
        name: "engine.code",
        meta: {
            layout: 'engine'
        }
    },
] as RouteRecordRaw[]