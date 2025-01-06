<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useStorage } from '@vueuse/core';
import { BaseDirectory, resolve } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { Scene } from 'atomic-engine-lib';

import IconComponent from '../icon.component.vue';

import storage from '@/domain/utils/storage';

import { useModalStore } from '@/stores/modal.store';
import { useSceneStore } from '@/stores/scene.store';
import { useEngineStore } from '@/stores/engine.store';
import { useProjectStore } from '@/stores/project.store';

const engineStore = useEngineStore()
const modalStore = useModalStore()
const projectStore = useProjectStore()

const { engine } = storeToRefs(engineStore)
const { scenes, currentScene } = storeToRefs(useSceneStore())
const { getPathProject } = projectStore

const stateStorage = useStorage("engine", storage)

const sceneSelected = ref<{ id: string, name: string } | null>(null)

const modal = modalStore.getModal("scenes")

const validScenes = ref<{
    id: string
    name: string
    open: boolean
}[]>([])

const open = async () => {
    if (sceneSelected.value === null) return

    const paths = await getPathProject()
    const pathCacheScenes = await resolve(paths['.project'], 'scenes.json')

    const cacheScenes = JSON.parse(await readTextFile(pathCacheScenes, {
        baseDir: BaseDirectory.AppData,
    }));

    const pathScene = await resolve(paths['.scenes'], cacheScenes[sceneSelected.value.id].path)

    stateStorage.value.current_scene = sceneSelected.value.id
    stateStorage.value.scenes_open.push({
        id: sceneSelected.value.id,
        name: sceneSelected.value.name,
        change: false
    })

    const sceneFile = await readTextFile(pathScene, {
        baseDir: BaseDirectory.AppData,
    });

    const scene = await Scene.import(sceneFile, "TOML")

    currentScene.value = scene

    engine.value?.scenes.add(scene)
    engine.value?.scenes.change(scene.slug)
    await engine.value?.scenes.load()

    sceneSelected.value = null

    modalStore.closeModal("scenes")
}

const handleShow = () => {
    validScenes.value = [...scenes.value.values()].map(({ id, name }) => {
        return {
            id,
            name,
            open: stateStorage.value.scenes_open.some((scene) => scene.id === id)
        }
    })
}

const handleHide = () => {
    sceneSelected.value = null
    validScenes.value = []
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Your scenes" :style="{ width: '25rem' }" modal :draggable="false"
        @hide="handleHide" @show="handleShow">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Select a scene to open it</span>
        <Listbox v-model="sceneSelected" :options="validScenes" filter optionLabel="name" optionDisabled="open"
            class="w-full mb-8">
            <template #option="slotProps">
                <div class="flex items-center">
                    <IconComponent name="mdiMovie" class="mr-2" />
                    <div>{{ slotProps.option.name }}</div>
                </div>
            </template>
        </Listbox>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Open" @click="open" :disabled="sceneSelected === null"></Button>
        </div>
    </Dialog>
</template>