<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { CanvasNode, Circle2D, GlobalNode, Image2D, Node2D, Rectangle2D, Sprite2D, Text2D } from 'atomic-engine-lib';

import type { TAnything } from '@/types';

import IconComponent from '../icon.component.vue';

import { useSceneStore } from '@/stores/scene.store';
import { useEngineStore } from '@/stores/engine.store';
import { listIconNode } from '@/domain/utils/icons';

import inspectorImage2dComponent from './inspectors/inspector-image-2d.component.vue';
import inspectorSprite2dComponent from './inspectors/inspector-sprite-2d.component.vue';
import inspectorRectangle2dComponent from './inspectors/inspector-rectangle-2d.component.vue';
import inspectorCircle2dComponent from './inspectors/inspector-circle-2d.component.vue';
import inspectorText2dComponent from './inspectors/inspector-text-2d.component.vue';
import inspectorNode2dComponent from './inspectors/inspector-node-2d.component.vue';
import inspectorCanvasNodeComponent from './inspectors/inspector-canvas-node.component.vue';
import inspectorGlobalNodeComponent from './inspectors/inspector-global-node.component.vue';
import inspectorScriptNodeComponent from './inspectors/inspector-script-node.component.vue';

const sceneStore = useSceneStore()
const engineStore = useEngineStore()
const { currentNodes } = storeToRefs(sceneStore)
const { engine } = storeToRefs(engineStore);

const sectionTab = ref("inspector")
const node = ref<GlobalNode | null>(null);
const inspectorsVisible = ref<string[]>([]);

const hasComponents = computed(() => {
    if (!node.value) return false

    return node.value.$components.getAll().length !== 0
})

const listInspectors: Record<string, TAnything> = {
    "inspector-image-2d": inspectorImage2dComponent,
    "inspector-sprite-2d": inspectorSprite2dComponent,
    "inspector-rectangle-2d": inspectorRectangle2dComponent,
    "inspector-circle-2d": inspectorCircle2dComponent,
    "inspector-text-2d": inspectorText2dComponent,
    "inspector-node-2d": inspectorNode2dComponent,
    "inspector-canvas-node": inspectorCanvasNodeComponent,
    "inspector-global-node": inspectorGlobalNodeComponent,
    "inspector-script-node": inspectorScriptNodeComponent,
}

const loadInspector = () => {
    if (!node.value) return

    let indexBasic = 0

    if (node.value.$attributes.getAll().length) {
        inspectorsVisible.value.push("inspector-script-node")
        indexBasic = 1
    }

    if (node.value instanceof Rectangle2D) {
        inspectorsVisible.value.splice(indexBasic, 1, "inspector-rectangle-2d");
    } else if (node.value instanceof Circle2D) {
        inspectorsVisible.value.splice(indexBasic, 1, "inspector-circle-2d");
    } else if (node.value instanceof Text2D) {
        inspectorsVisible.value.splice(indexBasic, 1, "inspector-text-2d");
    } else if (node.value instanceof Image2D) {
        inspectorsVisible.value.splice(indexBasic, 1, "inspector-image-2d");
    } else if (node.value instanceof Sprite2D) {
        inspectorsVisible.value.splice(indexBasic, 1, "inspector-sprite-2d");
    }

    if (node.value instanceof Node2D && inspectorsVisible.value.indexOf("inspector-node-2d") === -1)
        inspectorsVisible.value.push("inspector-node-2d");

    if (node.value instanceof CanvasNode && inspectorsVisible.value.indexOf("inspector-canvas-node") === -1)
        inspectorsVisible.value.push("inspector-canvas-node");

    if (node.value instanceof GlobalNode && inspectorsVisible.value.indexOf("inspector-global-node") === -1)
        inspectorsVisible.value.push("inspector-global-node");
}

const loadNode = () => {
    if (!engine.value) return

    if (!Object.keys(currentNodes.value).length) return

    const path = Object.keys(currentNodes.value)[0].replace("-", "/")

    if (path === node.value?.path) return

    const search = engine.value.ROOT.getNodeByPath(path, "index")

    if (!search) return

    node.value = search

    loadInspector()
}

watch(currentNodes, () => {
    loadNode()
}, { deep: true })

onMounted(() => {
    loadNode()
})

onUnmounted(() => {
    inspectorsVisible.value = []
    node.value = null
})

const handleLeave = () => {
    inspectorsVisible.value = []
    node.value = null
}
</script>

<template>
    <section class="absolute right-2 top-[52px]">
        <transition name="fade" mode="out-in" @after-leave="handleLeave">
            <section class="bg-zinc-900 rounded-md max-w-96 w-96 h-[700px]" v-show="Object.keys(currentNodes).length"
                style="font-family: 'JetBrains Mono', monospace;">
                <section class="w-full">
                    <Tabs v-model:value="sectionTab" scrollable>
                        <TabList>
                            <Tab value="inspector" class="px-3 py-4 flex gap-1 items-center">
                                <IconComponent name="mdiPackageVariant" />
                                Inspector
                            </Tab>
                            <Tab value="events" class="px-3 py-4 flex gap-1 items-center">
                                <IconComponent name="mdiLightningBolt" />
                                Events
                            </Tab>
                            <Tab value="groups" class="px-3 py-4 flex gap-1 items-center">
                                <IconComponent name="mdiCheckboxMultipleBlank" />
                                Groups
                            </Tab>
                            <Tab value="components" v-show="hasComponents" class="p-2">
                                Components
                            </Tab>
                        </TabList>
                    </Tabs>
                </section>
                <section class="flex flex-col mt-1 px-3 py-2">
                    <section class="flex items-center">
                        <Avatar size="large">
                            <template #icon>
                                <img :src="listIconNode[node?.NODE_NAME ?? '']" width="30" />
                            </template>
                        </Avatar>
                        <section class="flex flex-col ml-1">
                            <span class="uppercase font-bold text-sm max-w-[208.95px] truncate">
                                {{ node?.slug }}
                            </span>
                            <span class="text-sm font-light">
                                {{ node?.id }}
                            </span>
                        </section>
                    </section>
                </section>
                <ScrollPanel style="width: 100%; height: 560px">
                    <section class="px-3 pb-3 pt-1">
                        <transition-group name="list" tag="section" :css="true">
                            <component v-for="(inspector, index) of inspectorsVisible" :key="`${index}-${inspector}`"
                                :is="listInspectors[inspector]" :node="node" class="mb-2" />
                        </transition-group>
                    </section>
                </ScrollPanel>
            </section>
        </transition>
    </section>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.5s linear;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
}

.list-leave-active {
    width: 89.5%;
    position: absolute;
}

.accordion-inspector .p-accordionheader {
    background-color: transparent;
    padding: 10px;
}

.accordion-inspector .p-accordioncontent-content {
    background-color: transparent;
    padding: 10px;
}

.accordion-inspector .p-accordionpanel {
    margin: 8px 0px;
    border: 1px solid #3f3f46;
    border-radius: 0.375rem;
}
</style>