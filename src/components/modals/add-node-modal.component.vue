<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { toSnakeCase } from "@std/text"
import { ConstructorNodes } from "atomic-engine-lib"

import { listIconNode } from '@/domain/utils/icons';
import { useSceneChange } from '@/domain/utils/scene';

import { useModalStore } from '@/stores/modal.store';
import { useSceneStore } from '@/stores/scene.store';
import { useEngineStore } from '@/stores/engine.store';

const modalStore = useModalStore()
const { engine } = storeToRefs(useEngineStore())
const { currentScene } = storeToRefs(useSceneStore())
const { applyChange } = useSceneChange()

const modal = modalStore.getModal("add_node")

const nodeName = ref("");
const selectNode = ref("");

const systemNodes = ref<{
    name: string
    value: string
}[]>([])

const add = async () => {
    if (!engine.value) return

    if (!currentScene.value) return

    const invoke = ConstructorNodes.getNode(selectNode.value);

    if (!invoke) return

    const repeatNameNode = currentScene.value.$nodes.all.filter((node) => node.slug === nodeName.value).length

    const name = toSnakeCase(`${nodeName.value}${repeatNameNode ? ` ${repeatNameNode}` : ''}`).replace("_", "-")

    const node = new invoke(name)

    if (modal.data?.path) {
        const search = engine.value.ROOT.getNodeByPath(modal.data.path, 'index')

        if (!search) return

        search.$nodes.add(node)
    } else {
        if ("center" in node)
            node.center()

        currentScene.value.$nodes.add(node)
    }

    applyChange()

    modalStore.closeModal("add_node")
}

const cancel = () => {
    modalStore.closeModal("add_node")
}

const handleShow = () => {
    systemNodes.value = Object.keys(ConstructorNodes.getNodes()).filter((name) => name !== 'Scene').map((name) => {
        return {
            name,
            value: name
        }
    })
}

const handleHide_resetValue = () => {
    nodeName.value = ''
    selectNode.value = ''
    systemNodes.value = []
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Add node to scene" :style="{ width: '25rem' }" modal
        :draggable="false" @hide="handleHide_resetValue" @show="handleShow">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Node list</span>
        <div>
            <Listbox v-model="selectNode" :options="systemNodes" filter optionLabel="name" optionValue="value"
                optionDisabled="open" class="w-full mb-8">
                <template #option="slotProps">
                    <div class="flex items-center">
                        <img :src="listIconNode[slotProps.option.name]" width="26" class="mr-2" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </div>
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Node name</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText class="flex-auto" autocomplete="off" v-model="nodeName" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
            <Button type="button" label="Add" @click="add" :disabled="nodeName === '' || selectNode === null"></Button>
        </div>
    </Dialog>
</template>