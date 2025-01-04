<script setup lang="ts">
import { ref } from 'vue';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { BaseDirectory, resolve } from '@tauri-apps/api/path';

import { useModalStore } from '@/stores/modal.store';
import IconComponent from '../icon.component.vue';

const modalStore = useModalStore()

const modal = modalStore.getModal("add_file")

const fileName = ref("");
const typeFile = ref("txt");

const extensions = [
    {
        name: "Text",
        value: "txt",
        icon: "mdiFileDocument"
    },
    {
        name: "JavaScript",
        value: "js",
        icon: "mdiLanguageJavascript"
    },
    {
        name: "TypeScript",
        value: "ts",
        icon: "mdiLanguageTypescript"
    },
    {
        name: "JSON",
        value: "json",
        icon: "mdiCodeJson"
    },
    {
        name: "HTML",
        value: "html",
        icon: "mdiLanguageHtml5"
    },
    {
        name: "CSS",
        value: "css",
        icon: "mdiLanguageCss3"
    },
]

const accept = async () => {
    if (!modal.data) return

    if (!fileName.value) return
    if (!typeFile.value) return

    const path = await resolve(modal.data.path, `${fileName.value}.${typeFile.value}`);

    await writeTextFile(path, "", { baseDir: BaseDirectory.AppData, createNew: true });

    modalStore.closeModal("add_file")

    modalStore.addDataModal("add_file", {
        refresh: true
    })
}

const cancel = () => {
    modalStore.closeModal("add_file")
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Make a new file" :style="{ width: '25rem' }" modal :draggable="false"
        @hide="() => fileName = ''">
        <span class="text-surface-500 dark:text-surface-400 block mb-4">File name</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText class="flex-auto" autocomplete="off" v-model="fileName" />
        </div>
        <span class="text-surface-500 dark:text-surface-400 block mb-4">Format file</span>
        <div>
            <Listbox v-model="typeFile" :options="extensions" option-label="name" option-value="value" filter
                listStyle="max-height:250px">
                <template #option="slotProps">
                    <div class="flex items-center">
                        <IconComponent :name="slotProps.option.icon" class="mr-2" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
            </Listbox>
        </div>
        <div class="flex justify-end gap-2 mt-4">
            <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
            <Button type="button" label="Make" @click="accept"
                :disabled="fileName === '' || typeFile === null"></Button>
        </div>
    </Dialog>
</template>