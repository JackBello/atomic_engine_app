<script setup lang="ts">
import { getCurrentWindow, type Window } from '@tauri-apps/api/window';
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue';
import { useStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { BaseDirectory, open, readTextFile } from '@tauri-apps/plugin-fs';
import { resolve } from '@tauri-apps/api/path';
import { _Render, Scene } from 'atomic-engine-lib';

import IconComponent from './icon.component.vue';
import SelectSceneTabComponent from './engine/select-scene-tab.component.vue';

import storage from '@/domain/utils/storage';
import { useSceneChange } from '@/domain/utils/scene';

import { useEngineStore } from '@/stores/engine.store';
import { useSceneStore } from '@/stores/scene.store';
import { useModalStore } from '@/stores/modal.store';
import { useProjectStore } from '@/stores/project.store';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirmDialog = useConfirm()
const stateStorage = useStorage("engine", storage)

const engineStore = useEngineStore()
const modalStore = useModalStore()
const projectStore = useProjectStore()
const { currentNodes, currentScene } = storeToRefs(useSceneStore())
const { engine, modeEngine } = storeToRefs(engineStore)
const { currentProject } = storeToRefs(projectStore)
const { getPathProject } = projectStore
const { hasChangeScene, saveChange } = useSceneChange(stateStorage)

const win = ref<Window | null>(null)
const isMaximized = ref(false)

const layout = computed(() => route.meta.layout as string)

const handleClick_minimizeWindow = async () => {
    if (!win.value) return

    await win.value.minimize()
}

const handleClick_toggleSizeWindow = async () => {
    if (!win.value) return

    isMaximized.value = await win.value.isMaximized();

    if (isMaximized.value) {
        await win.value.unmaximize();
    } else {
        await win.value.maximize();
    }
}

const handleClick_closeWindow = async () => {
    if (!win.value) return

    if (hasChangeScene.value) {
        confirmDialog.require({
            message: "You have unsaved changes. Are you sure to close the window?",
            header: 'Close app',
            icon: 'mdiCloseThick',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Confirm',
                severity: 'success'
            },
            accept: async () => {
                if (!win.value) return

                currentProject.value = null
                currentNodes.value = {}
                stateStorage.value.project_open = null
                saveChange()

                await win.value.destroy();
            },
        });
        return
    }

    currentProject.value = null
    currentNodes.value = {}
    stateStorage.value.project_open = null

    await win.value.destroy();
}

const handleClick_goToDashboard = async () => {
    if (!hasChangeScene.value) {
        currentProject.value = null
        currentNodes.value = {}
        stateStorage.value.project_open = null

        await router.push({
            name: 'dashboard.index',
        })
        return
    }

    confirmDialog.require({
        message: "You have unsaved changes. Are you sure you want to exit to the dashboard?",
        header: 'Passing zone',
        icon: 'mdiHelp',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Confirm',
            severity: 'success'
        },
        accept: async () => {
            currentProject.value = null
            currentNodes.value = {}
            stateStorage.value.project_open = null
            saveChange()

            await router.push({
                name: 'dashboard.index',
            })
        },
    });
}

const handleUpdateModelValue = async (value: string | null) => {
    if (!value) return

    if (value === currentScene.value?.id) return

    const paths = await getPathProject()
    const pathCacheScenes = await resolve(paths['.project'], 'scenes.json')

    const cacheScenes = JSON.parse(await readTextFile(pathCacheScenes, {
        baseDir: BaseDirectory.AppData,
    }));

    const pathScene = await resolve(paths['.scenes'], cacheScenes[value].path)

    const sceneFile = await readTextFile(pathScene, {
        baseDir: BaseDirectory.AppData,
    });

    const scene = await Scene.import(sceneFile, "TOML")

    currentScene.value = scene
    currentNodes.value = {}

    engine.value?.scenes.add(scene)
    engine.value?.scenes.change(scene.slug)
    await engine.value?.scenes.load()
}

const handleClick_closeCurrentScene = ({ id, name }: { id: string, name: string }) => {
    if (!engine.value) return

    currentScene.value = null
    currentNodes.value = {}

    stateStorage.value.scenes_open = stateStorage.value.scenes_open.filter((scene) => scene.id !== id)

    engine.value.scenes.delete(name)

    engine.value[_Render].draw = true
}

const handleClick_openAddSceneModal = () => {
    modalStore.openModal("add_scene")
}

const handleClick_saveCurrentScene = async () => {
    if (!currentScene.value) return

    const paths = await getPathProject()

    const pathScene = await resolve(paths['.scenes'], `${currentScene.value.slug}.scene`)

    const file = await open(pathScene, {
        write: true,
        truncate: true,
        baseDir: BaseDirectory.AppData,
    });

    await file.write(new TextEncoder().encode(currentScene.value.export("TOML")));
    await file.close();

    saveChange()

    toast.add({ severity: 'success', summary: 'Scene Save', detail: `Scene '${currentScene.value.slug}' successfully save`, life: 3000, group: 'br' });
}

const handleClick_playScene = async () => {
    if (!engine.value) return

    await engine.value.control.preview.play()
}

const handleClick_pauseScene = () => {
    if (!engine.value) return

    engine.value.control.preview.pause()
}

const handleClick_stopScene = () => {
    if (!engine.value) return

    engine.value.control.preview.stop()
}

onBeforeMount(async () => {
    win.value = getCurrentWindow()
    isMaximized.value = await win.value.isMaximized();

    win.value.listen("tauri://resize", async () => {
        if (!win.value) return

        isMaximized.value = await win.value.isMaximized();
    })
})
</script>

<template>
    <section class="bg-zinc-900 flex items-center justify-between w-full relative border-b-[1px] border-zinc-700"
        data-tauri-drag-region>
        <section v-show="layout === 'dashboard'" class="text-xs ml-1">
            Atomic Engine
        </section>
        <section v-show="layout === 'engine'" class="flex">
            <Tag class="text-xs rounded-none bg-transparent" severity="secondary">
                <template #icon>
                    <IconComponent name="mdiGamepadVariant" />
                </template>
                {{ currentProject?.name }}
            </Tag>
            <Button text @click="handleClick_goToDashboard" size="small" class="rounded-none px-0 w-[36px]"
                severity="secondary" :disabled="modeEngine === 'preview'">
                <template #icon>
                    <IconComponent name="mdiViewDashboard" />
                </template>
            </Button>
            <Button text size="small" class="rounded-none px-0 w-[36px]" severity="secondary">
                <template #icon>
                    <IconComponent name="mdiMenu" />
                </template>
            </Button>
            <Button text size="small" class="rounded-none px-0 w-[36px]" severity="secondary">
                <template #icon>
                    <IconComponent name="mdiHelp" />
                </template>
            </Button>
            <Divider layout="vertical" class="m-0" />
            <Button text size="small" class="rounded-none px-0 w-[36px]" @click="handleClick_saveCurrentScene()"
                v-show="stateStorage.current_scene" :disabled="!hasChangeScene || modeEngine === 'preview'"
                severity="secondary">
                <template #icon>
                    <IconComponent name="mdiContentSave" />
                </template>
            </Button>
            <SelectSceneTabComponent @update:model-value="handleUpdateModelValue" v-model="stateStorage.current_scene"
                :scenes="stateStorage.scenes_open" :close-button="handleClick_closeCurrentScene"
                :disabled="modeEngine === 'preview'" />
            <Button text size="small" class="rounded-none px-0 w-[36px]" @click="handleClick_openAddSceneModal"
                severity="secondary" :disabled="modeEngine === 'preview'">
                <template #icon>
                    <IconComponent name="mdiPlus" />
                </template>
            </Button>
        </section>

        <section class="flex">
            <Divider layout="vertical" class="m-0" v-show="layout === 'engine'" />
            <section class="flex" v-show="layout === 'engine'">
                <Button text severity="secondary" size="small" class="rounded-none" @click="handleClick_playScene()"
                    :disabled="modeEngine === 'preview' || currentScene === null">
                    <IconComponent name="mdiMoviePlay" />
                </Button>
                <Button text severity="secondary" size="small" class="rounded-none"
                    :disabled="modeEngine === 'preview' || currentScene === null">
                    <IconComponent name="mdiPlay" />
                </Button>
                <Button text severity="secondary" size="small" class="rounded-none" @click="handleClick_pauseScene()"
                    :disabled="modeEngine === 'edition' || currentScene === null">
                    <IconComponent name="mdiPause" />
                </Button>
                <Button text severity="secondary" size="small" class="rounded-none" @click="handleClick_stopScene()"
                    :disabled="modeEngine === 'edition' || currentScene === null">
                    <IconComponent name="mdiStop" />
                </Button>
            </section>
            <Divider layout="vertical" class="m-0" v-show="layout === 'engine'" />
            <Button text @click="handleClick_minimizeWindow" size="small" class="rounded-none" severity="secondary">
                <IconComponent name="mdiMinus" />
            </Button>
            <Button text @click="handleClick_toggleSizeWindow" size="small" class="rounded-none" severity="secondary">
                <IconComponent :name="isMaximized ? 'mdiDockWindow' : 'mdiSquareRoundedOutline'" />
            </Button>
            <Button text @click="handleClick_closeWindow" size="small" class="rounded-none" severity="secondary">
                <IconComponent name="mdiClose" />
            </Button>
        </section>
    </section>
</template>