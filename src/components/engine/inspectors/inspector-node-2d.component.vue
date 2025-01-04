<script setup lang="ts">
import type { Node2D } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import TransformPanelComponent from './panels/node-2d/transform-panel.component.vue';
import OriginPanelComponent from './panels/node-2d/origin-panel.component.vue';
import SizePanelComponent from './panels/node-2d/size-panel.component.vue';
import OptionsPanelComponent from './panels/node-2d/options-panel.component.vue';

defineProps<{
    node: Node2D
}>()

const listNodeInvalidSize = ['Circle2D', 'Text2D', 'ControlEdition2D']
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Node 2D" node="Node2D" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <TransformPanelComponent value="0" :node="node" />
            <OriginPanelComponent value="1" :node="node" />
            <SizePanelComponent value="2" :node="node" :disabled="listNodeInvalidSize.includes(node.NODE_NAME)" />
            <OptionsPanelComponent value="3" :node="node" />
        </Accordion>
    </section>
</template>