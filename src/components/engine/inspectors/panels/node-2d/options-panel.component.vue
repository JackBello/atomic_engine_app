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
}>()

const flipX = ref(props.node.flipX)
const flipY = ref(props.node.flipY)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
    flipX.value = props.node.flipX
    flipY.value = props.node.flipY
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Options</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="flipX" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'flipX')" inputId="flipX" />
                    <span>
                        <label class="mb-2" for="flipX">Flip x</label>
                    </span>

                    <IconComponent name="mdiFlipHorizontal" size="24" class="absolute right-0" />
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="flipY" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'flipY')" inputId="flipY" />
                    <span>
                        <label class="mb-2" for="flipY">Flip y</label>
                    </span>

                    <IconComponent name="mdiFlipVertical" size="24" class="absolute right-0" />
                </section>
                <section class="flex justify-between flex-wrap">
                    <section class="w-full mb-2">
                        <span>Location</span>
                    </section>
                    <Button variant="outlined" label="Center X" size="small" rounded @click="() => {
                        node.centerX()
                        applyChange()
                    }" />
                    <Button variant="outlined" label="Center Y" size="small" rounded @click="() => {
                        node.centerY()
                        applyChange()
                    }" />
                    <Button variant="outlined" label="Center" size="small" rounded @click="() => {
                        node.center()
                        applyChange()
                    }" />
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>