<script setup lang="ts">
import type { CanvasNode } from "atomic-engine-lib";
import { computed, ref, watch } from "vue";

import type { TAnything } from "@/types";

import IconComponent from "@/components/icon.component.vue";

import { useSceneChange } from "@/domain/utils/scene";

const { applyChange } = useSceneChange();

const props = defineProps<{
    node: CanvasNode;
    value: string;
}>();

const visible = ref(props.node.visible);
const lock = ref(props.node.lock);
const selectable = ref(props.node.selectable);
const hovered = ref(props.node.hovered);
const cursor = ref(props.node.cursor);
const alpha = ref(props.node.alpha);
const compositeOperation = ref(props.node.compositeOperation);

const compositeOperationOptions = [
    "source-over",
    "source-in",
    "source-out",
    "source-atop",
    "destination-over",
    "destination-in",
    "destination-out",
    "destination-atop",
    "lighter",
    "copy",
    "xor",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "color-burn",
    "hard-light",
    "soft-light",
    "difference",
    "exclusion",
    "hue",
    "saturation",
    "color",
    "luminosity",
];

const id = computed(() => props.node.id);

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value;

    applyChange();
};

watch(id, () => {
    visible.value = props.node.visible;
    lock.value = props.node.lock;
    selectable.value = props.node.selectable;
    hovered.value = props.node.hovered;
    cursor.value = props.node.cursor;
    alpha.value = props.node.alpha;
    compositeOperation.value = props.node.compositeOperation
});
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Canvas</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="visible" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'visible')" inputId="visible" />
                    <span>
                        <label class="mb-2" for="visible">Visible</label>
                    </span>

                    <IconComponent :name="visible ? 'mdiEye' : 'mdiEyeOff'" size="24" class="absolute right-0" />
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="lock" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'lock')" inputId="lock" />
                    <span>
                        <label class="mb-2" for="lock">Lock</label>
                    </span>

                    <IconComponent :name="lock ? 'mdiLock' : 'mdiLockOpen'" size="24" class="absolute right-0" />
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="selectable" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'selectable')"
                        inputId="selectable" />
                    <span>
                        <label class="mb-2" for="selectable">Selectable</label>
                    </span>

                    <IconComponent :name="selectable ? 'mdiSelect' : 'mdiSelectOff'" size="24"
                        class="absolute right-0" />
                </section>
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="hovered" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'hovered')" inputId="hovered" />
                    <span>
                        <label class="mb-2" for="hovered">Hovered</label>
                    </span>

                    <IconComponent :name="hovered ? 'mdiMouse' : 'mdiMouseOff'" size="24" class="absolute right-0" />
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Cursor</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiCursorDefault" size="24" />
                            </InputGroupAddon>
                            <InputText type="text" v-model="cursor"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'cursor')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Composite Operation</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiTexture" size="24" />
                            </InputGroupAddon>
                            <Select v-model="compositeOperation" :options="compositeOperationOptions"
                                placeholder="Select a composite operation"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'compositeOperation')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Alpha</span>
                    <section class="flex flex-col gap-2">
                        <Slider v-model="alpha" class="mb-4" :min="0.0" :step="0.01" :max="1.0"
                            @update:model-value="(value) => handleUpdateModelValue(value, 'alpha')" />
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiWaterOpacity" size="24" />
                            </InputGroupAddon>
                            <InputNumber type="text" v-model="alpha" showButtons :min="0.01" :max="1.0" :step="0.1"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'alpha')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>