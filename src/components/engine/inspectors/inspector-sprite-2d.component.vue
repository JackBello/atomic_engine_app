<script setup lang="ts">
import type { Sprite2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';
import SourcePanelComponent from './panels/source-panel.component.vue';
import SmoothingPanelComponent from './panels/image-2d/smoothing-panel.component.vue';
import SpritePanelComponent from './panels/sprite-panel.component.vue';

defineProps<{
    node: Sprite2D
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Sprite 2D" node="Sprite2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <SpritePanelComponent value="0" :node="node" />
            <SourcePanelComponent value="1" :node="node" />
            <SmoothingPanelComponent value="2" :node="node" />
        </Accordion>
    </section>
</template>