<script setup lang="ts">
import { ref } from 'vue';

import { useModalStore } from '@/stores/modal.store';
import FileExplorerComponent from '../file-explorer.component.vue';
import type { TFileElement } from '@/types';
import { useProjectStore } from '@/stores/project.store';
import IconComponent from '../icon.component.vue';

const modalStore = useModalStore()

const modal = modalStore.getModal("file_explorer");
const { currentProject } = useProjectStore()

const showFileSystem = ref(false)

const pathSave = ref<string>("")

const handleShow = async () => {
    showFileSystem.value = true

    pathSave.value = modal.data?.path ?? ""
}

const handleHide = () => {
    showFileSystem.value = false
}

const handleClick_cancel = () => {
    modalStore.closeModal("file_explorer")
}

const handleClick_select = () => {
    modalStore.closeModal("file_explorer")

    modalStore.addDataModal("file_explorer", {
        save: `${pathSave.value}/`
    })
}

const handleSelect = (element: TFileElement | null) => {
    if (!element) {
        pathSave.value = modal.data?.path ?? ""
        return
    }

    pathSave.value = element.path
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="File Explorer" :style="{ width: '850px' }" modal :draggable="false"
        @show="handleShow" @hide="handleHide">
        <section>
            <Tag class="w-full">
                <template #default>
                    <section class="flex w-full items-center gap-2">
                        <IconComponent name="mdiFolder" />
                        <span class="text-surface-500 dark:text-surface-400 block"
                            style="font-family: 'JetBrains Mono', monospace;">
                            home://{{ pathSave.replace(currentProject?.path ?? "", "").replace(/\\/g,
                                "/").slice(1) }}
                        </span>
                    </section>
                </template>
            </Tag>
        </section>
        <section class="my-4">
            <FileExplorerComponent :show-menu-element="false" :show-menu-system="false" :show-three="false"
                filter-kind="folder" v-if="showFileSystem" :height="600" @select="handleSelect($event)"
                @change-path="(value) => pathSave = value" />
        </section>
        <section class="flex justify-between">
            <Button label="Cancel" @click="handleClick_cancel" />
            <Button label="Select" @click="handleClick_select" />
        </section>
    </Dialog>
</template>