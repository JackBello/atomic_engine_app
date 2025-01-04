<script setup lang="ts">
import { ref } from 'vue';

import { useModalStore } from '@/stores/modal.store';
import FileExplorerComponent from '../file-explorer.component.vue';
import type { TFileElement } from '@/types';

const modalStore = useModalStore()

const modal = modalStore.getModal("add_script_node");

const showFileSystem = ref(false)

const pathSave = ref<string>("")

const handleShow = async () => {
    showFileSystem.value = true
}

const handleHide = () => {
    showFileSystem.value = false
}

const handleClick_cancel = () => {
    modalStore.closeModal("add_script_node")
}

const handleClick_select = () => {
    modalStore.closeModal("add_script_node")

    modalStore.addDataModal("add_script_node", {
        script_path: pathSave.value
    })
}

const handleSelect = (element: TFileElement | null) => {
    if (!element) {
        pathSave.value = ""
        return
    }

    if (element.kind === "folder") {
        pathSave.value = ""
        return
    }

    pathSave.value = element.path
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Add" :style="{ width: '850px' }" modal :draggable="false"
        @show="handleShow" @hide="handleHide">
        <section class="my-4">
            <FileExplorerComponent :show-menu-element="false" :show-menu-system="false" :show-three="false"
                :filter="['js', 'ts']" v-if="showFileSystem" :height="600" @select="handleSelect($event)" />
        </section>
        <section class="flex justify-between">
            <Button label="Cancel" @click="handleClick_cancel" />
            <Button label="Select" @click="handleClick_select" :disabled="pathSave === ''" />
        </section>
    </Dialog>
</template>