<script setup lang="ts">
import MenuDashboardComponent from '@/components/dashboard/menu-dashboard.component.vue';
import ToolbarDashboardComponent from '@/components/dashboard/toolbar-dashboard.component.vue';
import MakeNewProjectModalComponent from '@/components/modals/make-new-project-modal.component.vue';
</script>

<template>
    <section class="w-full h-full flex flex-wrap">
        <section class="h-full flex-initial">
            <MenuDashboardComponent />
        </section>
        <section class="flex-auto flex flex-wrap flex-col box-border">
            <ToolbarDashboardComponent />
            <section class="p-2 box-border">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </section>
        </section>
        <MakeNewProjectModalComponent />
    </section>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>