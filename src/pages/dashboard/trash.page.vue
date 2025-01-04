<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { BaseDirectory, remove } from '@tauri-apps/plugin-fs';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue';

import type { IProject } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { timeAgo } from '@/domain/utils/dates';

import { useEngineStore } from '@/stores/engine.store';

const toast = useToast()
const confirmDialog = useConfirm()

const engineStore = useEngineStore()
const { getProjects, deleteProject, editProject } = engineStore
const { projects } = storeToRefs(engineStore)

const loadingProjects = ref(true);

const handleClick_deleteProject = (project: IProject) => {
    confirmDialog.require({
        message: `do you want to delete this '${project.name}' project?`,
        header: 'Danger Zone',
        icon: 'mdiClose',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            await deleteProject(project)

            await remove(project.path, { baseDir: BaseDirectory.AppData, recursive: true })

            projects.value = projects.value.filter(({ id }) => project.id !== id)

            toast.add({ severity: 'success', summary: 'Delete project', detail: `Project '${project.name}' successfully deleted`, life: 3000, group: 'bc' });
        },
    });
}

const handleClick_restoreProject = async (project: IProject) => {
    const data = { ...project };

    data.trash = false
    data.deleted_at = null;

    await editProject(data)

    projects.value = projects.value.filter(({ id }) => project.id !== id)

    toast.add({ severity: 'success', summary: 'Restore project', detail: `Project '${project.name}' successfully restored`, life: 3000, group: 'bc' });
}

const options = [
    {
        value: "list",
        icon: 'mdiViewList'
    },
    {
        value: 'grid',
        icon: 'mdiViewGrid'
    }
]
const layout = ref<"list" | "grid">("grid")

onMounted(async () => {
    projects.value = (await getProjects()).filter(({ trash }) => trash === true);

    loadingProjects.value = false
})

onUnmounted(() => {
    projects.value = []

    loadingProjects.value = true
})
</script>

<template>
    <section>
        <DataView :value="projects" data-key="value" :layout="layout" class="view-cards-projects">
            <template #header>
                <div class="flex justify-end">
                    <SelectButton v-model="layout" :options="options" :allowEmpty="false" option-value="value"
                        option-label="label">
                        <template #option="{ option }">
                            <IconComponent :name="option.icon" />
                        </template>
                    </SelectButton>
                </div>
            </template>

            <template #empty>
                <section class="flex justify-center items-center h-96">
                    <h1 class="text-xl">
                        you don't have any trashed files
                    </h1>
                </section>
            </template>

            <template #list="slotProps">
                <div class="flex flex-col gap-4">
                    <div v-show="loadingProjects">
                        Loading...
                    </div>
                    <div v-for="(project, index) in (slotProps.items as IProject[])" :key="index"
                        v-show="!loadingProjects">
                        {{ project.name }}
                    </div>
                </div>
            </template>

            <template #grid="slotProps">
                <div class="grid grid-cols-6 gap-4">
                    <div v-show="loadingProjects">
                        Loading...
                    </div>
                    <Card style="overflow: hidden" v-for="(project, index) in (slotProps.items as IProject[])"
                        :key="index" v-show="!loadingProjects" class="bg-slate-800 p-2">
                        <template #header>
                            <img alt="Project image" :src="project.image" v-if="project.image" />
                            <section class="rounded-md border-2 border-zinc-800 w-full h-36 bg-[#eeeeee]" v-else>
                            </section>
                        </template>
                        <template #subtitle>
                            <section class="flex justify-between items-center">
                                <span class="font-bold text-white">
                                    {{ project.name }}
                                </span>

                                <section>

                                </section>
                            </section>
                            <section>
                                {{ timeAgo('Trashed by you', project.deleted_at ?? '') }}
                            </section>
                        </template>
                        <template #content v-if="project.description">
                            <p class="m-0">
                                {{ project.description }}
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex gap-4 mt-1">
                                <Button severity="secondary" outlined @click="handleClick_deleteProject(project)">
                                    <template #icon>
                                        <IconComponent name="mdiClose" size="20" />
                                    </template>
                                </Button>
                                <Button severity="secondary" outlined @click="handleClick_restoreProject(project)">
                                    <template #icon>
                                        <IconComponent name="mdiRestore" size="20" />
                                    </template>
                                </Button>
                            </div>
                        </template>
                    </Card>
                </div>
            </template>
        </DataView>
    </section>
</template>

<style>
.view-cards-projects .p-dataview-header {
    background-color: inherit;
    border: none;
}

.view-cards-projects .p-dataview-content {
    background-color: inherit;
    border: none;
}

.view-cards-projects .p-dataview-empty-message {
    background-color: inherit;
    border: none;
}
</style>