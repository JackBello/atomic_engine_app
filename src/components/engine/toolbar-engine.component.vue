<script setup lang="ts">
import { storeToRefs } from "pinia";
import { _Render } from "atomic-engine-lib";
import { useStorage } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";

import type { TIcon } from "@/types";

import IconComponent from "../icon.component.vue";

import storage from "@/domain/utils/storage";

import { useSceneStore } from "@/stores/scene.store"
import { useModalStore } from "@/stores/modal.store";
import { useEngineStore } from "@/stores/engine.store";

const route = useRoute()
const router = useRouter()
const engineStore = useEngineStore()
const stateStorage = useStorage("engine", storage)
const { modeEngine } = storeToRefs(engineStore)
const { scenes } = storeToRefs(useSceneStore())
const modalStore = useModalStore()

const optionsCanvas: {
    icon: TIcon
    value: string
}[] = [
        { icon: 'mdiCursorDefault', value: 'node-selection' },
        { icon: 'mdiHandBackLeft', value: 'viewport-selection' },
        { icon: 'mdiCursorMove', value: 'node-move' },
        { icon: 'mdiRotateRight', value: 'node-rotate' },
        { icon: 'mdiArrowExpand', value: 'node-scale' },
        { icon: 'mdiRuler', value: 'viewport-rule' },
    ];

const optionsView: {
    icon: TIcon
    value: string
}[] = [
        { icon: 'mdiGrid', value: 'show-grid' },
        { icon: 'mdiAxisArrow', value: 'show-axis' },
    ];

const optionsDimension: {
    icon: TIcon
    value: "dimension-2d" | "dimension-3d"
}[] = [
        { icon: 'mdiVideo2d', value: 'dimension-2d' },
        { icon: 'mdiVideo3d', value: 'dimension-3d' },
    ];

const handleClick_showViewport = (value: string) => {
    if (stateStorage.value.showViewport.includes(value)) {
        stateStorage.value.showViewport = stateStorage.value.showViewport.filter((option) => option !== value)
    } else {
        stateStorage.value.showViewport.push(value)
    }
}

const openScenesModal = () => {
    modalStore.openModal("scenes")
}

const openEditorScript = () => {
    if (route.name === "engine.code") {
        router.push({ name: "engine.index" })
    } else {
        router.push({ name: "engine.code" })
    }
}
</script>

<template>
    <section class="w-full flex-initial">
        <section class=" bg-zinc-900 flex justify-between border-b-[1px] border-zinc-700 relative">
            <section>
                <Button class="rounded-none" text severity="secondary">
                    <template #icon>
                        <IconComponent name="mdiCog" />
                    </template>
                </Button>
                <Button class="rounded-none" text severity="secondary" :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiHistory" />
                    </template>
                </Button>
                <Button class="rounded-none" :disabled="scenes.size === 0 || modeEngine === 'preview'" text
                    @click="openScenesModal" severity="secondary">
                    <template #icon>
                        <IconComponent name="mdiMovieOpen" />
                    </template>
                </Button>
            </section>
            <section class="absolute left-1/2 -translate-x-1/2 flex h-full">
                <Divider layout="vertical" class="box-border m-0" />
                <Button severity="secondary" text class="rounded-none">
                    <template #default>
                        <IconComponent name="mdiDotsVertical" size="18" />
                    </template>
                </Button>
                <Divider layout="vertical" class="box-border m-0" />
                <Button :severity="stateStorage.lockCanvas ? 'success' : 'secondary'" text class="rounded-none"
                    @click="() => stateStorage.lockCanvas = !stateStorage.lockCanvas">
                    <template #default>
                        <IconComponent :name="stateStorage.lockCanvas ? 'mdiLock' : 'mdiLockOpen'" size="18" />
                    </template>
                </Button>
                <Divider layout="vertical" class="box-border m-0 before:bg-zinc-700" />
                <ButtonGroup>
                    <Button v-for="({ icon, value }, index) of optionsDimension" :key="index"
                        :severity="stateStorage.optionDimension === value ? 'success' : 'secondary'" text
                        class="rounded-none" @click="() => stateStorage.optionDimension = value">
                        <template #default>
                            <IconComponent :name="icon" size="18" />
                        </template>
                    </Button>
                </ButtonGroup>
                <Divider layout="vertical" class="box-border m-0 before:bg-zinc-700" />
                <ButtonGroup>
                    <Button v-for="({ icon, value }, index) of optionsCanvas" :key="index"
                        :severity="stateStorage.optionCanvas === value ? 'success' : 'secondary'" text
                        class="rounded-none" @click="() => stateStorage.optionCanvas = value">
                        <template #default>
                            <IconComponent :name="icon" size="18" />
                        </template>
                    </Button>
                </ButtonGroup>
                <Divider layout="vertical" class="box-border m-0 before:bg-zinc-700" />
                <ButtonGroup>
                    <Button v-for="({ icon, value }, index) of optionsView" :key="index"
                        :severity="stateStorage.showViewport.includes(value) ? 'success' : 'secondary'" text
                        class="rounded-none" @click="handleClick_showViewport(value)">
                        <template #default>
                            <IconComponent :name="icon" size="18" />
                        </template>
                    </Button>
                </ButtonGroup>
                <Divider layout="vertical" class="box-border m-0" />
            </section>
            <section>
                <Button class="rounded-none" text label="Script" @click="openEditorScript" severity="secondary"
                    :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiScriptText" />
                    </template>
                </Button>
                <Button class="rounded-none" text label="Assets" severity="secondary"
                    :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiShapePlus" />
                    </template>
                </Button>
                <Button class="rounded-none" text label="Import" severity="secondary"
                    :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiFileImport" />
                    </template>
                </Button>
            </section>
        </section>
    </section>
</template>