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

const position = ref(props.node.position)
const scale = ref(props.node.scale)
const skew = ref(props.node.skew)
const rotation = ref(props.node.rotation)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
    position.value = props.node.position
    scale.value = props.node.scale
    skew.value = props.node.skew
    rotation.value = props.node.rotation
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Transform</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Position</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAlphaX" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="position.x" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                                @update:model-value="() => applyChange()" />
                        </InputGroup>
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiAlphaY" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="position.y" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                                @update:model-value="() => applyChange()" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">scale</span>
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiAlphaX" size="24" />
                        </InputGroupAddon>
                        <InputNumber v-model="scale.x" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                            @update:model-value="() => applyChange()" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiAlphaY" size="24" />
                        </InputGroupAddon>
                        <InputNumber v-model="scale.y" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                            @update:model-value="() => applyChange()" />
                    </InputGroup>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">skew</span>
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiAlphaX" size="24" />
                        </InputGroupAddon>
                        <InputNumber v-model="skew.x" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                            @update:model-value="() => applyChange()" />
                    </InputGroup>
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiAlphaY" size="24" />
                        </InputGroupAddon>
                        <InputNumber v-model="skew.y" :minFractionDigits="2" :maxFractionDigits="5" showButtons
                            @update:model-value="() => applyChange()" />
                    </InputGroup>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">rotation</span>
                    <Slider v-model="rotation" class="mb-4" :min="-180" :max="180"
                        @update:model-value="(value) => handleUpdateModelValue(value, 'rotation')" />
                    <InputGroup>
                        <InputGroupAddon>
                            <IconComponent name="mdiRotate360" size="24" />
                        </InputGroupAddon>
                        <InputNumber v-model="rotation" :min="-180" :max="180"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'rotation')" showButtons />
                    </InputGroup>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>