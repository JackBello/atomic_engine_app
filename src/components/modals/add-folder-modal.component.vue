<script setup lang="ts">
import { ref } from 'vue';
import { mkdir } from '@tauri-apps/plugin-fs';
import { BaseDirectory, resolve } from '@tauri-apps/api/path';

import { useModalStore } from '@/stores/modal.store';

const modalStore = useModalStore()

const modal = modalStore.getModal("add_folder")

const folderName = ref("");

const accept = async () => {
    if (!modal.data) return

    if (!folderName.value) return

    const path = await resolve(modal.data.path, folderName.value)

    await mkdir(path, { baseDir: BaseDirectory.AppData, recursive: true });

    modalStore.closeModal("add_folder")

    modalStore.addDataModal("add_folder", {
        refresh: true
    })
}

const cancel = () => {
    modalStore.closeModal("add_folder")
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Make a new folder" :style="{ width: '25rem' }" modal
        :draggable="false" @hide="() => folderName = ''">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Folder name</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText class="flex-auto" autocomplete="off" v-model="folderName" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
            <Button type="button" label="Make" @click="accept" :disabled="folderName === ''"></Button>
        </div>
    </Dialog>
</template>