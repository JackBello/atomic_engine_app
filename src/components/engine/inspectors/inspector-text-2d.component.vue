<script setup lang="ts">
import type { Text2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import DrawPanelComponent from './panels/draw-panel.component.vue';
import TextPanelComponent from './panels/text-panel.component.vue';

defineProps<{
    node: Text2D
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Text 2D" node="Text2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <TextPanelComponent value="0" :node="node" />
            <DrawPanelComponent value="1" :node="node" />
        </Accordion>
    </section>
</template>
