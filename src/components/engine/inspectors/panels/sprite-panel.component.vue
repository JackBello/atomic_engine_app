<script setup lang="ts">
import IconComponent from '@/components/icon.component.vue';
import type { Sprite2D } from 'atomic-engine-lib';
import { computed, type HTMLAttributes, ref, watch } from 'vue';

import { useSceneChange } from '@/domain/utils/scene';

import { useModalStore } from '@/stores/modal.store';
import type { TAnything } from '@/types';

const { applyChange } = useSceneChange()

const modalStore = useModalStore()

const modal = modalStore.getModal("add_source")

const data = computed(() => modal.data)

const props = defineProps<{
    node: Sprite2D
    value: string
}>()

const frame = ref(props.node.frame)
const frameCoords = ref(props.node.frameCoords)
const spriteSettings = ref(props.node.spriteSettings)
const resource = ref(props.node.resource)

const id = computed(() => props.node.id);

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

const styleSpritePreview = computed(() => {
    if (!resource.value) return {
        width: '0px',
        height: '0px',
        backgroundImage: 'none',
        backgroundSize: '0px 0px',
        backgroundPosition: '0px 0px',
        imageRendering: 'pixelated',
    } as HTMLAttributes['style']

    const scale = 8

    const grid = {
        x: 0,
        y: 0
    }

    if (Array.isArray(spriteSettings.value.grid)) {
        grid.x = spriteSettings.value.grid[1]
        grid.y = spriteSettings.value.grid[0]
    }

    if (typeof spriteSettings.value.grid === 'number') {
        grid.x = spriteSettings.value.grid
        grid.y = spriteSettings.value.grid
    }

    return {
        width: `${scale * spriteSettings.value.width}px`,
        height: `${scale * spriteSettings.value.height}px`,
        backgroundImage: `url('${resource.value.source}')`,
        backgroundSize: `${scale * spriteSettings.value.width * grid.x}px ${scale * spriteSettings.value.height * grid.y}px`,
        backgroundPosition: `${scale * -frameCoords.value.x * spriteSettings.value.width}px ${scale * -frameCoords.value.y * spriteSettings.value.height}px`,
        imageRendering: 'pixelated',
    } as HTMLAttributes['style']
})

watch(data, (value) => {
    if (value && 'resource' in value) {
        resource.value = value.resource
    }
})

watch(id, () => {
    frame.value = props.node.frame
    frameCoords.value = props.node.frameCoords
    spriteSettings.value = props.node.spriteSettings
    resource.value = props.node.resource
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Sprite</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-2">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Frame</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiImageFrame" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="frame" :useGrouping="false" :min="0" showButtons
                                @update:model-value="(value) => handleUpdateModelValue(value, 'frame')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Frame Coords</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAlphaX" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="frameCoords.x" :useGrouping="false" :min="0" showButtons
                                @update:model-value="() => applyChange()" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAlphaY" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="frameCoords.y" :useGrouping="false" :min="0" showButtons
                                @update:model-value="() => applyChange()" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-show="resource">
                    <span class="mb-2">Preview</span>
                    <section class="flex w-full justify-center items-center">
                        <div :style="styleSpritePreview">
                        </div>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>