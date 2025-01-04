<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Scene } from 'atomic-engine-lib';
import { useStorage } from '@vueuse/core';
import { toSnakeCase } from "@std/text"
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { resolve } from '@tauri-apps/api/path';

import storage from '@/domain/utils/storage';

import { useModalStore } from '@/stores/modal.store';
import { useSceneStore } from '@/stores/scene.store';
import { useEngineStore } from '@/stores/engine.store';

const modalStore = useModalStore()
const engineStore = useEngineStore()
const { scenes, currentScene } = storeToRefs(useSceneStore())
const { engine } = storeToRefs(engineStore)
const { getPathProject } = engineStore

const stateStorage = useStorage("engine", storage)

const modal = modalStore.getModal("add_scene")

const sceneName = ref("");

const accept = async () => {
    const repeatSceneName = [...scenes.value.values()].filter(({ name }) => name === sceneName.value).length
    const name = toSnakeCase(`${sceneName.value}${repeatSceneName === 0 ? '' : ` ${repeatSceneName}`}`)

    const paths = await getPathProject()

    const scene = new Scene(name)

    const pathScene = await resolve(paths['.scenes'], `${name}.scene`)
    const pathCacheScenes = await resolve(paths['.project'], 'scenes.json')

    const cacheScenes = JSON.parse(await readTextFile(pathCacheScenes, {
        baseDir: BaseDirectory.AppData,
    }));

    await writeTextFile(pathScene, scene.export("TOML"), {
        baseDir: BaseDirectory.AppData,
        createNew: true
    });

    cacheScenes[scene.id] = {
        id: scene.id,
        name,
        path: pathScene
    }

    await writeTextFile(pathCacheScenes, JSON.stringify(cacheScenes), {
        baseDir: BaseDirectory.AppData,
    });

    scenes.value.add({
        id: scene.id,
        name: scene.slug
    })

    stateStorage.value.current_scene = scene.id;
    stateStorage.value.scenes_open.push({
        id: scene.id,
        name: scene.slug,
        change: false
    })

    currentScene.value = scene

    engine.value?.scenes.add(scene)
    engine.value?.scenes.change(scene.slug)

    await engine.value?.scenes.load()

    sceneName.value = ""

    modalStore.closeModal("add_scene")
}

const cancel = () => {
    modalStore.closeModal("add_scene")
}
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Make a new scene" :style="{ width: '25rem' }" modal
        :draggable="false" @hide="() => sceneName = ''">
        <span class="text-surface-500 dark:text-surface-400 block mb-8">Scene name</span>
        <div class="flex items-center gap-4 mb-4">
            <InputText class="flex-auto" autocomplete="off" v-model="sceneName" />
        </div>
        <div class="flex justify-end gap-2">
            <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
            <Button type="button" label="Save" @click="accept" :disabled="sceneName === ''"></Button>
        </div>
    </Dialog>
</template>