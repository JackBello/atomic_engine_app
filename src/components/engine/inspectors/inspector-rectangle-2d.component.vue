<script setup lang="ts">
import type { Rectangle2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import DrawPanelComponent from './panels/draw-panel.component.vue';
import RectanglePanelComponent from './panels/rectangle-panel.component.vue';

defineProps<{
    node: Rectangle2D
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Rectangle 2D" node="Rectangle2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <RectanglePanelComponent value="0" :node="node" />
            <DrawPanelComponent value="1" :node="node" />
        </Accordion>
    </section>
</template>
