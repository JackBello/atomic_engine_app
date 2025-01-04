<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { useConfirm } from "primevue/useconfirm";
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';

import type { IProject } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { compareTime, getDateNow, timeAgo } from '@/domain/utils/dates';
import storage from '@/domain/utils/storage';

import { useEngineStore } from '@/stores/engine.store';

const stateStorage = useStorage("engine", storage)

const engineStore = useEngineStore()
const { getProjects, editProject } = engineStore
const { projects, currentProject } = storeToRefs(engineStore)

const toast = useToast()
const confirmDialog = useConfirm()
const router = useRouter()

const loadingProjects = ref(true);

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

const messageCard = (project: IProject) => {
    const compare = compareTime(project.updated_at, project.created_at)

    return timeAgo(compare ? 'Edited' : 'Created', compare ? project.updated_at : project.created_at)
}

const handleClick_moveTrashProject = (project: IProject) => {
    confirmDialog.require({
        message: `Do you want to move this project '${project.name}' to the trash?`,
        header: 'Danger Zone',
        icon: 'mdiDelete',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Confirm',
            severity: 'danger'
        },
        accept: async () => {
            const data = { ...project };

            data.trash = true
            data.deleted_at = getDateNow();

            await editProject(data)

            stateStorage.value.current_scene = null
            stateStorage.value.scenes_open = []

            projects.value = projects.value.filter(({ id }) => project.id !== id)

            toast.add({ severity: 'success', summary: 'Project trash', detail: `Project '${project.name}' successfully moved to trash`, life: 3000, group: 'bc' });
        },
    });
}

const handleClick_removeFavorites = async (project: IProject) => {
    const data = { ...project };

    data.favorite = false

    await editProject(data)

    projects.value = projects.value.filter(({ id }) => project.id !== id)
}

const handleClick_openProject = async (project: IProject) => {
    const data = { ...project };

    data.opened_at = getDateNow();

    await editProject(data)

    stateStorage.value.project_open = {
        id: project.id,
        name: project.name
    }

    currentProject.value = data

    await router.push({
        name: 'engine.index'
    })
}

onMounted(async () => {
    projects.value = (await getProjects()).filter(({ trash, favorite }) => trash === false && favorite === true);

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
                        you don't have any projects favorites
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
                                    <Button :severity="project.favorite ? 'warn' : 'secondary'" class="rounded-full"
                                        variant="text" @click="handleClick_removeFavorites(project)">
                                        <template #icon>
                                            <IconComponent name="mdiStar" size="20" />
                                        </template>
                                    </Button>
                                </section>
                            </section>
                            <section>
                                {{ messageCard(project) }}
                            </section>
                        </template>
                        <template #content v-if="project.description">
                            <p class="m-0">
                                {{ project.description }}
                            </p>
                        </template>
                        <template #footer>
                            <div class="flex gap-4 mt-1">
                                <Button severity="secondary" outlined @click="handleClick_openProject(project)">
                                    <template #icon>
                                        <IconComponent name="mdiOpenInNew" size="20" />
                                    </template>
                                </Button>
                                <Button severity="secondary" outlined>
                                    <template #icon>
                                        <IconComponent name="mdiPencil" size="20" />
                                    </template>
                                </Button>
                                <Button severity="secondary" outlined @click="handleClick_moveTrashProject(project)">
                                    <template #icon>
                                        <IconComponent name="mdiDelete" size="20" />
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