<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Text2D } from "atomic-engine-lib";

import type { TAnything } from "@/types";

import IconComponent from "@/components/icon.component.vue";

import { useSceneChange } from "@/domain/utils/scene";

const { applyChange } = useSceneChange();

const props = defineProps<{
    node: Text2D;
    value: string;
}>();

const text = ref(props.node.text);
const fontSize = ref(Number(props.node.fontSize.slice(0, -2)));
const fontFamily = ref(props.node.fontFamily);
const fontStretch = ref(props.node.fontStretch);
const fontStyle = ref(props.node.fontStyle);
const fontWeight = ref(props.node.fontWeight);
const fontVariant = ref(props.node.fontVariant);
const textAlign = ref(props.node.textAlign);
const textBaseline = ref(props.node.textBaseline);
const textDirection = ref(props.node.textDirection);

const fontFamilyOptionsWindow = [
    "arial",
    "calibri",
    "cambria",
    "candara",
    "comic sans ms",
    "consolas",
    "courier new",
    "georgia",
    "segoe ui",
    "tahoma",
    "times new roman",
    "trebuchet ms",
    "verdana",
    "system-ui",
];

const fontStretchOptions = [
    "ultra-condensed",
    "extra-condensed",
    "condensed",
    "semi-condensed",
    "normal",
    "semi-expanded",
    "expanded",
    "extra-expanded",
    "ultra-expanded",
];

const fontStyleOptions = ["normal", "italic", "oblique"];

const fontWeightOptions = [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
];

const fontVariantOptions = ["normal", "small-caps"];

const textAlignOptions = ["left", "center", "right"];

const textBaselineOptions = [
    "top",
    "bottom",
    "hanging",
    "middle",
    "alphabetic",
    "ideographic",
];

const textDirectionOptions = ["inherit", "ltr", "rtl"];

const id = computed(() => props.node.id);

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value;

    applyChange();
};

watch(id, () => {
    text.value = props.node.text;
    fontSize.value = Number(props.node.fontSize.slice(0, -2));
    fontFamily.value = props.node.fontFamily;
    fontStretch.value = props.node.fontStretch;
    fontStyle.value = props.node.fontStyle;
    fontWeight.value = props.node.fontWeight;
    fontVariant.value = props.node.fontVariant;
    textAlign.value = props.node.textAlign;
    textBaseline.value = props.node.textBaseline;
    textDirection.value = props.node.textDirection;
});
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Text</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Content</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiText" size="24" />
                            </InputGroupAddon>
                            <InputText v-model="text"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'text')" rows="5"
                                class="w-full resize-none" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Size</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatSize" size="24" />
                            </InputGroupAddon>
                            <InputNumber v-model="fontSize" inputId="horizontal-buttons" showButtons
                                @update:modelValue="(value) => handleUpdateModelValue(`${value}px`, 'fontSize')"
                                buttonLayout="horizontal" mode="decimal">
                                <template #incrementbuttonicon>
                                    <IconComponent name="mdiPlus" size="24" />
                                </template>
                                <template #decrementbuttonicon>
                                    <IconComponent name="mdiMinus" size="24" />
                                </template>
                            </InputNumber>
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Family</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatFont" size="24" />
                            </InputGroupAddon>
                            <Select v-model="fontFamily" :options="fontFamilyOptionsWindow"
                                placeholder="Select a font family"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'fontFamily')">
                                <template #option="slotProps">
                                    <section class="flex items-center" :style="`font-family: '${slotProps.option}';`">
                                        <span>{{ slotProps.option }}</span>
                                    </section>
                                </template>
                            </Select>
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Stretch</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatTextRotationNone" size="24" />
                            </InputGroupAddon>
                            <Select v-model="fontStretch" :options="fontStretchOptions"
                                placeholder="Select a font stretch"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'fontStretch')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Style</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatItalic" size="24" />
                            </InputGroupAddon>
                            <Select v-model="fontStyle" :options="fontStyleOptions" placeholder="Select a font style"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'fontStyle')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Weight</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatBold" size="24" />
                            </InputGroupAddon>
                            <Select v-model="fontWeight" :options="fontWeightOptions" placeholder="Select a font weight"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'fontWeight')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Font Variant</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatTextVariant" size="24" />
                            </InputGroupAddon>
                            <Select v-model="fontVariant" :options="fontVariantOptions"
                                placeholder="Select a font variant"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'fontVariant')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Text Align</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent
                                    :name="(`mdiFormatAlign${textAlign.slice(0, 1).toUpperCase() + textAlign.slice(1)}` as TAnything)"
                                    size="24" />
                            </InputGroupAddon>
                            <Select v-model="textAlign" :options="textAlignOptions" placeholder="Select a text align"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'textAlign')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Text Baseline</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatAlignTop" size="24" />
                            </InputGroupAddon>
                            <Select v-model="textBaseline" :options="textBaselineOptions"
                                placeholder="Select a text baseline"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'textBaseline')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Text Direction</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiFormatPilcrow" size="24" />
                            </InputGroupAddon>
                            <Select v-model="textDirection" :options="textDirectionOptions"
                                placeholder="Select a text direction"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'textDirection')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>