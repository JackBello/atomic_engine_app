<script setup lang="ts">
import type { Circle2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import DrawPanelComponent from './panels/draw-panel.component.vue';
import CirclePanelComponent from './panels/circle-panel.component.vue';

defineProps<{
    node: Circle2D
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Circle 2D" node="Circle2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <CirclePanelComponent value="0" :node="node" />
            <DrawPanelComponent value="1" :node="node" />
        </Accordion>
    </section>
</template>