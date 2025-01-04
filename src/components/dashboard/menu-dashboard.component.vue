<script setup lang="ts">
import { TIcon } from '@/types';
import { useRoute, useRouter } from 'vue-router';

import IconComponent from '../icon.component.vue';

const router = useRouter()
const route = useRoute()

const items = [
    {
        label: "Dashboard",
        icon: 'mdiViewDashboard',
        command: () => {
            router.push({
                name: 'dashboard.index'
            })
        },
        name: 'dashboard.index'
    },
    {
        label: 'Recent',
        icon: "mdiClockTimeThree",
        command: () => {
            router.push({
                name: 'dashboard.recent'
            })
        },
        name: 'dashboard.recent'
    },
    {
        separator: true,
    },
    {
        label: 'Your projects',
        icon: 'mdiFolder',
        items: [
            {
                label: 'All projects',
                icon: 'mdiViewGrid',
                command: () => {
                    router.push({
                        name: 'dashboard.allProjects'
                    })
                },
                name: 'dashboard.allProjects'
            },
            {
                label: 'Favorite',
                icon: 'mdiStar',
                command: () => {
                    router.push({
                        name: 'dashboard.favorite'
                    })
                },
                name: 'dashboard.favorite'
            },
            {
                label: 'Trash',
                icon: 'mdiDelete',
                command: () => {
                    router.push({
                        name: 'dashboard.trash'
                    })
                },
                name: 'dashboard.trash'
            }
        ]
    },
    {
        separator: true,
    },
    {
        label: 'quick access',
        items: []
    },
    {
        separator: true,
    },
    {
        label: 'Community',
        icon: 'mdiWeb',
        command: () => {
            router.push({
                name: 'dashboard.community'
            })
        },
        name: 'dashboard.community'
    },
    {
        label: 'Settings',
        icon: 'mdiCog',
        command: () => {
            router.push({
                name: 'dashboard.settings'
            })
        },
        name: 'dashboard.settings'
    },
];
</script>

<template>
    <Menu :model="items"
        class="w-full md:w-60 h-full rounded-none relative menu-dashboard border-l-0 border-t-0 border-b-0 p-2">
        <template #item="{ item, props }">
            <a v-ripple class="flex items-center" :class="item.name === route.name ? 'bg-zinc-700 rounded-sm' : ''"
                v-bind="props.action">
                <IconComponent :name="(item.icon as TIcon)" />
                <span>{{ item.label }}</span>
            </a>
        </template>
        <template #end>
            <section class="p-1 box-border">
                <Button v-ripple label="Login" />
            </section>
        </template>
    </Menu>
</template>

<style>
.menu-dashboard .p-menu-end {
    position: absolute;
    bottom: 0px;
    width: 100%;
}
</style>