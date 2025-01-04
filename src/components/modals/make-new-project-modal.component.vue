<script setup lang="ts">
import * as ulid from "@std/ulid";
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { toSnakeCase } from "@std/text"
import { useToast } from 'primevue';
import { resolve, BaseDirectory } from '@tauri-apps/api/path';
import { mkdir, writeTextFile } from '@tauri-apps/plugin-fs';

import type { IProject } from '@/types';

import { getDateNow } from "@/domain/utils/dates";

import { useModalStore } from '@/stores/modal.store';
import { useEngineStore } from '@/stores/engine.store';

const engineStore = useEngineStore()
const { addProject } = useEngineStore()
const { projects, root } = storeToRefs(engineStore)

const modalStore = useModalStore()
const modal = modalStore.getModal("make_new_project")

const toast = useToast()

const projectName = ref('Untitled')

const loading = ref(false);

const create = async () => {
    loading.value = true;

    const path = await resolve(root.value ?? '', toSnakeCase(projectName.value).toLowerCase())

    await mkdir(path, { baseDir: BaseDirectory.AppData });

    await mkdir(await resolve(path, '.project'), { baseDir: BaseDirectory.AppData })

    await mkdir(await resolve(path, '.scenes'), { baseDir: BaseDirectory.AppData })

    await mkdir(await resolve(path, '.favorites'), { baseDir: BaseDirectory.AppData })

    await mkdir(await resolve(path, '.packages'), { baseDir: BaseDirectory.AppData })

    await mkdir(await resolve(path, '.trash'), { baseDir: BaseDirectory.AppData })

    await writeTextFile(await resolve(path, '.project', 'scenes.json'), "{}", {
        baseDir: BaseDirectory.AppData,
    });

    const format = getDateNow()

    const newProject: IProject = {
        id: ulid.monotonicUlid(16),
        name: projectName.value,
        description: undefined,
        image: undefined,
        path,
        tags: [],
        trash: false,
        favorite: false,
        created_at: format,
        updated_at: format,
        deleted_at: null,
        opened_at: null,
        info: {
            context: "2d",
            type: "2D",
            mode: "edition"
        }
    }

    addProject(newProject)

    projects.value.push(newProject)

    modalStore.closeModal("make_new_project")

    toast.add({ severity: 'success', summary: 'Projects', detail: 'Project successfully completed', life: 3000, group: 'bc' });
}

const cancel = () => {
    modalStore.closeModal("make_new_project")
}

const hide = () => {
    projectName.value = '';
    loading.value = false;
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Make a new project" :style="{ width: '25rem' }" modal
        :draggable="false" @hide="hide">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Project name</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText class="flex-auto" autocomplete="off" v-model="projectName" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="cancel" :loading="loading" />
            <Button type="button" label="Create" @click="create" :disabled="projectName === ''" :loading="loading" />
        </div>
    </Dialog>
</template>