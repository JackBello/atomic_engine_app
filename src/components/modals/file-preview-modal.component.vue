<script setup lang="ts">
import { ref } from 'vue';
import { readFile } from '@tauri-apps/plugin-fs';
import { BaseDirectory } from '@tauri-apps/api/path';

import { useModalStore } from '@/stores/modal.store';
import type { TFileElement } from '@/types';

const modalStore = useModalStore()

const modal = modalStore.getModal("file_preview");

const source = ref<{
    type: "audio" | "video" | "image" | "document" | "other" | "code" | "archive" | "font" | "3d";
    value: string;
}>({
    type: "other",
    value: ""
});

const handleShow = async () => {
    const file = modal.data.element as TFileElement;

    const buffer = await readFile(file.path, {
        baseDir: BaseDirectory.AppData
    })

    const bytes = new Uint8Array(buffer);

    if (file.format && file.ext) {
        const blob = new Blob([bytes], { type: `${file.format}/${file.ext}` });
        source.value.type = file.format;
        source.value.value = URL.createObjectURL(blob);
    }
}

const handleHide = () => {
    source.value = {
        type: "other",
        value: ""
    };
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Preview File" :style="{ width: '600px' }" modal :draggable="false"
        @show="handleShow" @hide="handleHide">
        <section class="flex justify-center items-center">
            <img v-if="source.type === 'image'" :src="source.value"
                style="height: 500px; object-fit: contain; image-rendering: pixelated;" />
            <audio :src="source.value" v-else-if="source.type === 'audio'" controls style="width: 100%;"></audio>
            <video :src="source.value" v-else-if="source.type === 'video'" controls style="width: 100%;"></video>
        </section>
    </Dialog>
</template>