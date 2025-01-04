<script setup lang="ts">
import type { ContextMenuProps } from 'primevue';
import IconComponent from './icon.component.vue';
import type { TAnything } from '@/types';
import { onMounted, ref } from 'vue';

const element = ref()

defineProps<{
    options: ContextMenuProps['model'];
}>()

const emits = defineEmits<{
    load: [value: TAnything]
}>()

onMounted(() => {
    emits("load", element.value)
})
</script>

<template>
    <ContextMenu :model="options" ref="element">
        <template #item="{ item, props }">
            <a v-ripple class="flex items-center" v-bind="props.action" v-show="item.show">
                <IconComponent :name="(item.icon as TAnything)" />
                <span class="ml-1 text-xs">{{ item.label }}</span>
                <Badge v-show="item.badge" class="ml-auto" :value="item.badge" />
                <span v-show="item.shortcut"
                    class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{
                        item.shortcut }}</span>
                <i v-show="item.items" class="pi pi-angle-right ml-auto"></i>
            </a>
        </template>
    </ContextMenu>
</template>