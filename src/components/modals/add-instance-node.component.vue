<script setup lang="ts">
import { ref } from 'vue';

import { useModalStore } from '@/stores/modal.store';
import FileExplorerComponent from '../file-explorer.component.vue';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';
import { GlobalNode } from 'atomic-engine-lib';
import { useSceneStore } from '@/stores/scene.store';
import { storeToRefs } from 'pinia';
import type { TFileElement } from '@/types';
import { useEngineStore } from '@/stores/engine.store';
import { useSceneChange } from '@/domain/utils/scene';

const { engine } = storeToRefs(useEngineStore())
const { currentScene } = storeToRefs(useSceneStore())
const modalStore = useModalStore()
const { applyChange } = useSceneChange()

const modal = modalStore.getModal("add_instance_node")

const showFileSystem = ref(false)

const instanceNodePath = ref<TFileElement | null>(null)

const add = async () => {
    if (!engine.value) return

    if (!currentScene.value) return

    if (!instanceNodePath.value) return

    const content = await readTextFile(instanceNodePath.value.path, {
        baseDir: BaseDirectory.AppData,
    })

    const node = await GlobalNode.import(content, "TOML");

    node.$script.modeExecute = "none"

    if (modal.data?.path) {
        const search = engine.value.ROOT.getNodeByPath(modal.data.path, 'index')

        if (!search) return

        search.$nodes.add(node)
    } else {
        if ("center" in node)
            node.center()

        currentScene.value.$nodes.add(node)
    }

    await node.$script.executeScript()

    applyChange()

    modalStore.closeModal("add_instance_node")
}

const cancel = () => {
    modalStore.closeModal("add_instance_node")
}

const handleShow = () => {
    showFileSystem.value = true
}

const handleHidden = () => {
    instanceNodePath.value = null
    showFileSystem.value = false
}
</script>

<template>
    <Dialog v-model:visible="modal.active" modal :draggable="false" header="Add instance node"
        :style="{ width: '800px' }" @show="handleShow" @hide="handleHidden">
        <section class="flex flex-col">
            <section>

            </section>
            <section>
                <FileExplorerComponent :filter="['object']" :show-three="false" v-if="showFileSystem" :height="400"
                    @select="(value) => instanceNodePath = value" />
            </section>

            <section class="flex justify-end mt-4">
                <section class="flex gap-1">
                    <Button type="button" label="Cancel" severity="secondary" @click="cancel()" />
                    <Button @click="add()" label="Add" :disabled="instanceNodePath === null" />
                </section>
            </section>
        </section>
    </Dialog>
</template>