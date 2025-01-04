<script setup lang="ts">
import { computed, ref } from 'vue';

import { useModalStore } from '@/stores/modal.store';
import type { GlobalNode } from 'atomic-engine-lib';
import FileExplorerComponent from '../file-explorer.component.vue';
import IconComponent from '../icon.component.vue';
import { BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';

const modalStore = useModalStore()

const modal = modalStore.getModal("save_instance_node")

const showFileSystem = ref(false)

const fileName = ref("")
const pathSave = ref("")

const computedFileName = computed({
    get() {
        return `${fileName.value}.object`
    },
    set(value: string) {
        fileName.value = value.replace(".object", "")
    }
})

const save = async () => {
    const node = modal.data.node as GlobalNode

    if (!node) return
    if (!fileName.value) return
    if (!pathSave.value) return

    const pathNode = `${pathSave.value}/${fileName.value}.object`

    node.wrap = true

    await writeTextFile(pathNode, node.export("TOML"), {
        baseDir: BaseDirectory.AppData,
        createNew: true
    })

    modalStore.closeModal("save_instance_node")
}

const cancel = () => {
    modalStore.closeModal("save_instance_node")
}

const handleShow = () => {
    showFileSystem.value = true
}

const handleHidden = () => {
    fileName.value = ""
    pathSave.value = ""
    showFileSystem.value = false
}
</script>

<template>
    <Dialog v-model:visible="modal.active" modal :draggable="false" header="Save instance node"
        :style="{ width: '800px' }" @show="handleShow" @hide="handleHidden">
        <section class="flex flex-col">
            <section>

            </section>
            <section>
                <FileExplorerComponent :show-three="false" v-if="showFileSystem" :height="400"
                    @change-path="(path) => pathSave = path" />
            </section>

            <section class="flex justify-between mt-4">
                <section>
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiCube" size="24" />
                        </InputGroupAddon>
                        <InputText v-model="computedFileName" class="w-full resize-none text-right" />
                    </InputGroup>
                </section>

                <section class="flex">
                    <Button type="button" label="Cancel" severity="secondary" @click="cancel()" />
                    <Button @click="save()" label="Save" :disabled="fileName === ''" />
                </section>
            </section>
        </section>
    </Dialog>
</template>