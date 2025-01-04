<script setup lang="ts">
import { computed, defineAsyncComponent, type DefineComponent, onMounted, shallowRef, watch } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia";

import { useEngineStore } from "@/stores/engine.store"
import type { TAnything } from "@/types";

const { loading } = storeToRefs(useEngineStore())

const route = useRoute()

const routeLayout = computed(() =>
    route.meta.layout ? route.meta.layout as string : "default"
)

const layouts: Record<string, DefineComponent<TAnything, TAnything, TAnything>> = {
    dashboard: defineAsyncComponent(() => import('./dashboard.layout.vue')),
    engine: defineAsyncComponent(() => import('./engine.layout.vue')),
    loading: defineAsyncComponent(() => import("./loading.layout.vue"))
}

const layout = shallowRef(layouts[routeLayout.value])

watch(loading, () => {
    layout.value = layouts[routeLayout.value]
})

watch(routeLayout, (value) => {
    layout.value = layouts[value]
})

onMounted(() => {
    if (loading.value) {
        layout.value = layouts.loading
    }
})
</script>

<template>
    <keep-alive>
        <transition name="fade" mode="out-in">
            <component :is="layout" />
        </transition>
    </keep-alive>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>