<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { BaseDirectory, resolve } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useStorage, useWindowSize } from '@vueuse/core';
import { _Render, EngineCore, GlobalNode, Image2D, Node2D, ResourceImage, Scene } from 'atomic-engine-lib';

import type { TAnything, TFileElement } from '@/types';

import ToolbarComponent from '@/components/engine/toolbar-engine.component.vue';
import PanelSceneNodesComponent from '@/components/engine/panel-scene-nodes.component.vue';
import InspectorNodesComponent from '@/components/engine/inspector-nodes.component.vue';
import ModalsComponent from '@/components/engine/modals-engine.component.vue';
import ActionViewBarComponent from '@/components/engine/action-view-bar.component.vue';
import ActionHistoryAndZoomBarComponent from '@/components/engine/action-history-and-zoom-bar.component.vue';

import storage from '@/domain/utils/storage';

import { useSceneStore } from '@/stores/scene.store';
import { useEngineStore } from '@/stores/engine.store';
import { useMenuStore } from '@/stores/menus.store';
import PanelFilesystemComponent from '@/components/engine/panel-filesystem.component.vue';
import SelectionPlugin from '@/domain/engine/plugins/selection/plugin';
import ContextMenuBasicComponent from '@/components/context-menu-basic.component.vue';
import { useProjectStore } from '@/stores/project.store';

const engineStore = useEngineStore()
const projectStore = useProjectStore()

const { scenes, currentScene, currentNodes, hoverNode, referenceNode } = storeToRefs(useSceneStore())
const { getPathProject } = projectStore
const stateStorage = useStorage("engine", storage)
const { engine, positionMouse } = storeToRefs(engineStore)
const { menuNodeOptions, menuCanvasOptions } = storeToRefs(useMenuStore())

const { width, height } = useWindowSize()

const canvasOptions = ref([
    {
        show: false,
        icon: "mdiContentPaste",
        label: "Paste",
        command: () => {
            if (!currentScene.value) return

            if (!referenceNode.value.node) return

            currentScene.value.$nodes.add(referenceNode.value.node as GlobalNode);

            if (referenceNode.value.node instanceof Node2D) {
                referenceNode.value.node.position.x = positionMouse.value[0]
                referenceNode.value.node.position.y = positionMouse.value[1]

                positionMouse.value = [0, 0]
            }

            referenceNode.value = {
                node: null,
                type: "copy",
            };
        },
    },
    {
        show: true,
        icon: "mdiRefresh",
        label: "Refresh",
        command: () => {
            if (!engine.value) return

            engine.value[_Render].draw = true
        },
    }
])

const handleClick_openMenuNodeOptions = (event: MouseEvent) => {
    positionMouse.value = [event.clientX, event.clientY]

    if (menuCanvasOptions.value)
        menuCanvasOptions.value.show(event);

    if (menuNodeOptions.value && hoverNode.value) {
        const path = hoverNode.value.path.replace("/", "-")

        const object: Record<string, boolean> = {};
        object[path] = true;

        currentNodes.value = object

        menuNodeOptions.value.show(event);
    }
};

const handleDrop = async (event: DragEvent) => {
    event.preventDefault();

    if (!currentScene.value) return

    const data = JSON.parse(event.dataTransfer?.getData("application/json") || '{}') as TFileElement;

    let node: GlobalNode | null = null;

    if (data.ext && data.ext === "object") {
        const content = await readTextFile(data.path, {
            baseDir: BaseDirectory.AppData,
        })

        node = await GlobalNode.import(content, "TOML");

        node.$script.modeExecute = "none"

        await node.$script.executeScript()
    }

    if (data.format && data.format === "image") {
        const resource = new ResourceImage(data.name, {
            origin: "anonymous",
            source: data.preview
        });

        await resource.load()

        node = new Image2D(data.name, {}, resource);

        node.originalSize()
    }

    if (!node) return

    if (node instanceof Node2D) {
        node.position.x = event.clientX
        node.position.y = event.clientY
    }

    currentScene.value.$nodes.add(node);
}

watch([width, height], ([newWidth, newHeight]) => {
    if (engine.value)
        engine.value.setSize(newWidth, newHeight)
})

onMounted(async () => {
    engine.value = new EngineCore({
        context: "2d",
        dimension: "2D",
        background: "#636363",
        width: width.value,
        height: height.value,
        selector: "#editor",
    })

    engine.value.input.defineAction("move_left", [
        "keyboard/arrowLeft",
        "keyboard/keyA",
        "joyPad/crossLeft",
    ]);

    engine.value.input.defineAction("move_right", [
        "keyboard/arrowRight",
        "keyboard/keyD",
        "joyPad/crossRight",
    ]);

    engine.value.input.defineAction("move_up", [
        "keyboard/arrowUp",
        "keyboard/keyW",
        "joyPad/crossUp",
    ]);

    engine.value.input.defineAction("move_down", [
        "keyboard/arrowDown",
        "keyboard/keyS",
        "joyPad/crossDown",
    ]);

    engine.value.resolver("script", async (url: string | URL) => {
        return await readTextFile(url, {
            baseDir: BaseDirectory.AppData,
        })
    })

    engine.value.use(SelectionPlugin)

    engine.value.selection.emit("select:node", (node: GlobalNode | null) => {
        if (node) {
            const object: Record<string, boolean> = {}
            const path = node.path.replace("/", "-")

            object[path] = true

            currentNodes.value = object
        }
        else
            currentNodes.value = {}
    })

    engine.value.selection.emit("hover:node", (node: GlobalNode | null) => {
        if (node) hoverNode.value = node
        else hoverNode.value = null
    })

    const paths = await getPathProject()

    const pathCacheScene = await resolve(paths['.project'], 'scenes.json')

    const cacheScenes = JSON.parse(await readTextFile(pathCacheScene, {
        baseDir: BaseDirectory.AppData,
    }))

    scenes.value = new Set(Object.values(cacheScenes).map(({ id, name }: TAnything) => ({ id, name })))

    if (stateStorage.value.current_scene) {
        const pathScene = await resolve(paths['.scenes'], cacheScenes[stateStorage.value.current_scene].path)

        const sceneFile = await readTextFile(pathScene, {
            baseDir: BaseDirectory.AppData,
        });

        const scene = await Scene.import(sceneFile, "TOML")

        currentScene.value = scene

        engine.value?.scenes.add(scene)
        engine.value?.scenes.change(scene.slug)
        await engine.value?.scenes.load()
    }
})
</script>

<template>
    <section class="flex justify-center h-full w-full relative flex-wrap">
        <section id="editor" class="absolute top-0 left-0 w-full" @contextmenu="handleClick_openMenuNodeOptions"
            @drop="handleDrop" @dragover.prevent>
        </section>
        <ToolbarComponent />
        <PanelSceneNodesComponent />
        <InspectorNodesComponent />
        <ActionHistoryAndZoomBarComponent />
        <PanelFilesystemComponent />
        <ActionViewBarComponent />
        <ModalsComponent />
        <ContextMenuBasicComponent :options="canvasOptions" @load="(value) => menuCanvasOptions = value" />
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </section>
</template>