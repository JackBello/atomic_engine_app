<script setup lang="ts">
import type { GlobalNode } from 'atomic-engine-lib';

import IconComponent from '@/components/icon.component.vue';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';

import EditorPanelComponent from './panels/global-node/editor-panel.component.vue';
import ProcessPanelComponent from './panels/global-node/process-panel.component.vue';
import ComponentsPanelComponent from './panels/global-node/components-panel-component.vue';
import MetadataPanelComponent from './panels/global-node/metadata-panel.component.vue';

defineProps<{
    node: GlobalNode
}>()
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Global Node" node="GlobalNode" />
        <Accordion multiple class="w-full accordion-inspector">
            <template #collapseicon>
                <IconComponent name="mdiMinus" />
            </template>
            <template #expandicon>
                <IconComponent name="mdiPlus" />
            </template>
            <EditorPanelComponent value="0" :node="node" />
            <ProcessPanelComponent value="1" :node="node" />
            <ComponentsPanelComponent value="2" :node="node" />
            <MetadataPanelComponent value="3" :node="node" />
        </Accordion>
    </section>
</template>