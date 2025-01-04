<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Circle2D } from 'atomic-engine-lib';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: Circle2D
    value: string
}>()

const radius = ref(props.node.radius)
const startAngle = ref(props.node.startAngle)
const endAngle = ref(props.node.endAngle)
const counterclockwise = ref(props.node.counterclockwise)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
    radius.value = props.node.radius
    startAngle.value = props.node.startAngle
    endAngle.value = props.node.endAngle
    counterclockwise.value = props.node.counterclockwise
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Circle</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Radius</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="radius" class="mb-4" :min="0" :max="1000"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'radius')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiRadius" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="radius" mode="decimal" showButtons :min="0" :max="1000"
                                @update:model-value="(value) => handleUpdateModelValue(value, 'radius')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Start Angle</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="startAngle" class="mb-4" :min="0" :max="20"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'startAngle')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAngleAcute" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="startAngle" mode="decimal" showButtons :min="0" :max="20"
                                @update:model-value="(value) => handleUpdateModelValue(value, 'startAngle')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">End Angle</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="endAngle" class="mb-4" :min="0" :max="20"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'endAngle')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAngleAcute" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="endAngle" mode="decimal" showButtons :min="0" :max="20"
                                @update:model-value="(value) => handleUpdateModelValue(value, 'endAngle')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="counterclockwise" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'counterclockwise')"
                        inputId="counterclockwise" />
                    <span>
                        <label class="mb-2" for="counterclockwise">Counter Clock Wise</label>
                    </span>

                    <IconComponent :name="counterclockwise ? 'mdiClockTimeFourOutline' : 'mdiClockTimeEightOutline'"
                        size="24" class="absolute right-0" />
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>