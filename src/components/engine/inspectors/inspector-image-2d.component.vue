<script setup lang="ts">
import type { Image2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';
import SourcePanelComponent from './panels/source-panel.component.vue';
import SmoothingPanelComponent from './panels/image-2d/smoothing-panel.component.vue';

defineProps<{
    node: Image2D
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Image 2D" node="Image2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <SourcePanelComponent value="0" :node="node" />
            <SmoothingPanelComponent value="1" :node="node" />
        </Accordion>
    </section>
</template>