<script setup lang="ts">
import type { Rectangle2D } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: Rectangle2D
    value: string
}>()

const toggleRounded = ref(typeof props.node.rounded !== 'number')

const id = computed(() => props.node.id)

const rounded = ref(props.node.rounded)

const roundedNumber = computed({
    set(value: number) {
        rounded.value = value
    },
    get() {
        return rounded.value as number
    }
})

const roundedObject = computed({
    set(value: {
        topLeft: number;
        topRight: number;
        bottomLeft: number;
        bottomRight: number;
    }) {
        rounded.value = value
    },
    get() {
        return rounded.value as {
            topLeft: number;
            topRight: number;
            bottomLeft: number;
            bottomRight: number;
        }
    }
})

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(toggleRounded, value => {
    if (value)
        rounded.value = {
            topLeft: 0,
            topRight: 0,
            bottomLeft: 0,
            bottomRight: 0
        }
    else
        rounded.value = 0

    props.node.rounded = rounded.value
})

watch(id, () => {
    rounded.value = props.node.rounded
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Rectangle</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Type Rounded</span>
                    <section>
                        <ToggleSwitch v-model="toggleRounded" />
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-if="typeof rounded === 'number'">
                    <span class="mb-2">Rounded</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="roundedNumber" class="mb-4" :min="0" :max="50"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'rounded')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiSquareRounded" size="24" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="roundedNumber" showButtons :min="0" :max="50"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'rounded')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-if="typeof rounded !== 'number'">
                    <span class="mb-2">Rounded Top Left</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="roundedObject.topLeft" class="mb-4" :min="0" :max="50"
                            @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiRoundedCorner" size="24" class="-rotate-45"
                                    style="--r: -90deg" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="roundedObject.topLeft" showButtons :min="0" :max="50"
                                @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-if="typeof rounded !== 'number'">
                    <span class="mb-2">Rounded Top Right</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="roundedObject.topRight" class="mb-4" :min="0" :max="50"
                            @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiRoundedCorner" size="24" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="roundedObject.topRight" showButtons :min="0" :max="50"
                                @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-if="typeof rounded !== 'number'">
                    <span class="mb-2">Rounded Bottom Left</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="roundedObject.bottomLeft" class="mb-4" :min="0" :max="50"
                            @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiRoundedCorner" size="24" class="-rotate-45"
                                    style="--r: -180deg" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="roundedObject.bottomLeft" showButtons :min="0" :max="50"
                                @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2" v-if="typeof rounded !== 'number'">
                    <span class="mb-2">Rounded Bottom Right</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="roundedObject.bottomRight" class="mb-4" :min="0" :max="50"
                            @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiRoundedCorner" size="24" class="-rotate-45"
                                    style="--r: 90deg" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="roundedObject.bottomRight" showButtons :min="0" :max="50"
                                @update:model-value="handleUpdateModelValue(roundedObject, 'rounded')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>