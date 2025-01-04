<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Circle2D, Rectangle2D, Text2D } from 'atomic-engine-lib';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const props = defineProps<{
    node: Rectangle2D | Circle2D | Text2D
    value: string
}>()

const { applyChange } = useSceneChange()

const fill = ref(props.node.fill.slice(1));
const stroke = ref((props.node.stroke ?? "").slice(1));
const lineWidth = ref(props.node.lineWidth)

const hasStroke = ref(props.node.stroke !== '')

const id = computed(() => props.node.id)

const popoverFill = ref()
const popoverStroke = ref()

const openPopoverColor = (event: MouseEvent, type: string) => {
    if (type === "fill") {
        popoverFill.value.toggle(event)
    }
    if (type === "stroke") {
        popoverStroke.value.toggle(event)
    }
}

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

const iconsLineWidth: Record<string, TAnything> = {
    "Rectangle2D": "mdiBorderAllVariant",
    "Circle2D": "mdiCircleOutline",
    "Text2D": "mdiFormatTextVariantOutline"
}

watch(hasStroke, (value) => {
    if (value)
        stroke.value = "000000"
    else
        stroke.value = ""

    props.node.stroke = stroke.value
})

watch(id, () => {
    fill.value = props.node.fill.slice(1)
    stroke.value = (props.node.stroke ?? "").slice(1)
    lineWidth.value = props.node.lineWidth
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Draw</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Fill</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiPalette" size="24" />
                            </InputGroupAddon>
                            <InputText type="text" v-model="fill"
                                @update:modelValue="(value) => handleUpdateModelValue(`#${value}`, 'fill')" />
                            <InputGroupAddon>
                                <div class="cursor-pointer rounded-sm w-6 h-6 border-[1px] border-white"
                                    :style="`background-color: #${fill};`"
                                    @click="(event) => openPopoverColor(event, 'fill')">
                                </div>
                                <Popover ref="popoverFill">
                                    <ColorPicker v-model="fill" inline
                                        @update:modelValue="(value) => handleUpdateModelValue(`#${value}`, 'fill')" />
                                </Popover>
                            </InputGroupAddon>
                        </InputGroup>
                    </section>
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="hasStroke" binary inputId="lock" />
                    <span>
                        <label class="mb-2" for="lock">Has Stroke</label>
                    </span>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Stroke</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiPalette" size="24" />
                            </InputGroupAddon>
                            <InputText :disabled="stroke === ''" type="text" v-model="stroke"
                                @update:modelValue="(value) => handleUpdateModelValue(`#${value}`, 'stroke')" />
                            <InputGroupAddon>
                                <div class="cursor-pointer rounded-sm w-6 h-6 border-[1px] border-white"
                                    :style="`background-color: #${stroke};`"
                                    @click="(event) => openPopoverColor(event, 'stroke')">
                                </div>
                                <Popover ref="popoverStroke">
                                    <ColorPicker v-model="stroke" inline :disabled="stroke === ''"
                                        @update:modelValue="(value) => handleUpdateModelValue(`#${value}`, 'stroke')" />
                                </Popover>
                            </InputGroupAddon>
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Line Width</span>
                    <section class="flex flex-col gap-2">
                        <Slider :disabled="stroke === ''" v-model="lineWidth" class="mb-4" :min="0" :max="100"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'lineWidth')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent :name="iconsLineWidth[node.NODE_NAME]" size="24" />
                            </InputGroupAddon>
                            <InputNumber :disabled="stroke === ''" v-model="lineWidth" mode="decimal" showButtons
                                :min="0" :max="100"
                                @update:model-value="(value) => handleUpdateModelValue(value, 'lineWidth')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>