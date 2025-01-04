<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Node2D } from 'atomic-engine-lib';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: Node2D
    value: string
    disabled: boolean
}>()

const width = ref(props.node.width)
const height = ref(props.node.height)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
    width.value = props.node.width
    height.value = props.node.height
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Size</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-2">
                <InputGroup>
                    <InputGroupAddon>
                        <IconComponent name="mdiArrowSplitVertical" size="24" />
                    </InputGroupAddon>
                    <InputNumber v-model="width" :minFractionDigits="2" :maxFractionDigits="5"
                        @update:model-value="(value) => handleUpdateModelValue(value, 'width')" showButtons
                        :disabled="disabled" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <IconComponent name="mdiArrowSplitHorizontal" size="24" />
                    </InputGroupAddon>
                    <InputNumber v-model="height" :minFractionDigits="2" :maxFractionDigits="5"
                        @update:model-value="(value) => handleUpdateModelValue(value, 'height')" showButtons
                        :disabled="disabled" />
                </InputGroup>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>