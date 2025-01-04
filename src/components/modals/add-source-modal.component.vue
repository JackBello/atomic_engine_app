<script setup lang="ts">
import { ref } from 'vue';

import { useModalStore } from '@/stores/modal.store';
import { type Image2D, ResourceImage, ResourceSpriteSheet } from 'atomic-engine-lib';
import FileExplorerComponent from '../file-explorer.component.vue';
import type { TAnything, TFileElement } from '@/types';

const modalStore = useModalStore()

const modal = modalStore.getModal("add_source")

const showFileSystem = ref(false)

const selectFile = ref<TFileElement | null>(null)

const spriteSettings = ref<{
    border: [number, number],
    grid: [number, number],
    width: number,
    height: number,
    spacing: [number, number]
}>({
    border: [0, 0],
    grid: [1, 1],
    width: 0,
    height: 0,
    spacing: [0, 0]
})

const add = async () => {
    if (!selectFile.value) return

    if (!modal.data.node) return

    const node: Image2D = modal.data.node

    let resource: TAnything

    if (node.NODE_NAME === "Image2D") {
        resource = new ResourceImage(selectFile.value.name, {
            origin: "anonymous",
            source: selectFile.value.preview
        });
    }

    if (node.NODE_NAME === "Sprite2D") {
        resource = new ResourceSpriteSheet(selectFile.value.name, {
            origin: "anonymous",
            source: selectFile.value.preview,
            border: spriteSettings.value.border,
            grid: spriteSettings.value.grid,
            width: spriteSettings.value.width,
            height: spriteSettings.value.height,
            spacing: spriteSettings.value.spacing
        });
    }

    await resource.load()

    node.changeResource(resource)

    node.originalSize()

    modalStore.closeModal("add_source")

    modalStore.addDataModal("add_source", {
        resource
    })
}

const show = () => {
    showFileSystem.value = true
}

const hidden = () => {
    showFileSystem.value = false
    selectFile.value = null
}
</script>

<template>
    <Dialog v-model:visible="modal.active" modal :draggable="false" header="Add source" :style="{ width: '800px' }"
        @show="show" @hide="hidden">
        <section class="flex flex-col">
            <section class="flex justify-center items-center flex-wrap mb-4 h-96">
                <section class="flex w-full gap-1"
                    v-show="selectFile?.preview && selectFile.kind === 'file' && selectFile.format === 'image' && modal.data.node.NODE_NAME === 'Sprite2D'">
                    <div class="flex-auto">
                        <label for="width" class="font-bold block mb-2"> Width </label>
                        <InputNumber v-model="spriteSettings.width" inputId="width" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                    <div class="flex-auto">
                        <label for="height" class="font-bold block mb-2"> Height </label>
                        <InputNumber v-model="spriteSettings.height" inputId="height" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                    <div class="flex-auto">
                        <label for="gridX" class="font-bold block mb-2"> Grid Y </label>
                        <InputNumber v-model="spriteSettings.grid[0]" inputId="gridX" :useGrouping="false" fluid
                            :min="1" />
                    </div>
                    <div class="flex-auto">
                        <label for="gridY" class="font-bold block mb-2"> Grid X </label>
                        <InputNumber v-model="spriteSettings.grid[1]" inputId="gridY" :useGrouping="false" fluid
                            :min="1" />
                    </div>
                    <div class="flex-auto">
                        <label for="spaceX" class="font-bold block mb-2"> Space Y </label>
                        <InputNumber v-model="spriteSettings.spacing[0]" inputId="spaceX" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                    <div class="flex-auto">
                        <label for="spaceY" class="font-bold block mb-2"> Space X </label>
                        <InputNumber v-model="spriteSettings.spacing[1]" inputId="spaceY" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                    <div class="flex-auto">
                        <label for="borderX" class="font-bold block mb-2"> Border Y </label>
                        <InputNumber v-model="spriteSettings.border[0]" inputId="borderX" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                    <div class="flex-auto">
                        <label for="borderY" class="font-bold block mb-2"> Border X </label>
                        <InputNumber v-model="spriteSettings.border[1]" inputId="borderY" :useGrouping="false" fluid
                            :min="0" />
                    </div>
                </section>

                <img :src="selectFile?.preview"
                    v-show="selectFile?.preview && selectFile.kind === 'file' && selectFile.format === 'image'"
                    class="object-contain h-80 mt-4" style="image-rendering: pixelated;" />
                <span v-show="!selectFile?.preview || (selectFile?.preview && selectFile.kind !== 'file')"
                    class="text-gray-400 text-xl">No image selected</span>
            </section>

            <section>
                <FileExplorerComponent :show-menu-element="false" :show-menu-system="false" :show-three="false"
                    filter="image" v-if="showFileSystem" @select="selectFile = $event" :height="260" />
            </section>

            <section class="flex justify-end">
                <Button @click="add()" :disabled="!(selectFile?.format === 'image' && selectFile.kind === 'file')"
                    label="Select" />
            </section>
        </section>
    </Dialog>
</template>