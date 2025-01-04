<script setup lang="ts">
import type { TAnything } from '@/types';

import IconComponent from '../icon.component.vue';

const props = defineProps<{
    scenes: TAnything[]
    disabled: boolean
    closeButton: (scene: TAnything) => void
}>()

const model = defineModel<string | null>({
    default: null
})

const handleClick_selectScene = (scene: TAnything) => {
    if (props.disabled) return
    model.value = scene.id
}

const handleClick_closeScene = (scene: TAnything) => {
    if (props.disabled) return
    model.value = null
    props.closeButton(scene)
}
</script>

<template>
    <section class="flex justify-center items-center">
        <div v-for="(scene, index) of scenes" :key="index" @click.self="handleClick_selectScene(scene)"
            class="px-2 py-[2px] text-xs transition-all ease-in-out duration-300 flex items-center"
            :class="{ 'text-green-400': model === scene.id, 'opacity-50': disabled, 'cursor-pointer': !disabled }">
            <Badge severity="success" size="small" style="min-width: .6rem; height: .6rem;" v-show="scene.change"
                @click.self="handleClick_selectScene(scene)" class="mr-2" />
            <span @click.self="handleClick_selectScene(scene)">
                {{ scene.name }}
            </span>
            <Button class="ml-1 p-1 w-auto h-max text-xs rounded-none" :class="{
                'text-green-400': model === scene.id,
                'text-white': model !== scene.id
            }" size="small" @click="handleClick_closeScene(scene)" text :disabled="disabled">
                <template #icon>
                    <IconComponent name="mdiClose" size="12" />
                </template>
            </Button>
        </div>
    </section>
</template>