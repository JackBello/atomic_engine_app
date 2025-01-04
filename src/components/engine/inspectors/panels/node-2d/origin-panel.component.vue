<script setup lang="ts">
import type { Node2D } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: Node2D
    value: string
}>()

const optionsOriginX = ["center", "left", "right"]
const optionsOriginY = ["center", "top", "bottom"]

const originX = ref(props.node.originX)
const originY = ref(props.node.originY)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Origin</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-2">
                <InputGroup>
                    <InputGroupAddon>
                        <IconComponent name="mdiAlphaX" size="24" />
                    </InputGroupAddon>
                    <Select v-model="originX" :options="optionsOriginX" placeholder="Select a OriginX"
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'originX')" />
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon>
                        <IconComponent name="mdiAlphaY" size="24" />
                    </InputGroupAddon>
                    <Select v-model="originY" :options="optionsOriginY" placeholder="Select a OriginY"
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'originY')" />
                </InputGroup>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>