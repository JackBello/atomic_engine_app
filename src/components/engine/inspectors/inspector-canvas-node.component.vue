<script setup lang="ts">
import type { CanvasNode } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import CanvasPanelComponent from './panels/canvas-node/canvas-panel.component.vue';

defineProps<{
    node: CanvasNode
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Canvas Node" node="CanvasNode" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <CanvasPanelComponent value="0" :node="node" />
        </Accordion>
    </section>
</template>