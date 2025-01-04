<script setup lang="ts">
import IconComponent from '@/components/icon.component.vue';
import { useSceneChange } from '@/domain/utils/scene';
import type { TAnything } from '@/types';
import type { Image2D, Sprite2D } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

const { applyChange } = useSceneChange();

const props = defineProps<{
    node: Image2D | Sprite2D
    value: string
}>()

const smoothing = ref(props.node.smoothing)
const smoothingQuality = ref(props.node.smoothingQuality)

const smoothingQualityOptions = ["low", "medium", "high"]

const id = computed(() => props.node.id);

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value;

    applyChange();
};

watch(id, () => {
    smoothing.value = props.node.smoothing
    smoothingQuality.value = props.node.smoothingQuality
});
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Smoothing</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex items-center gap-2 relative">
                    <Checkbox v-model="smoothing" binary
                        @update:modelValue="(value) => handleUpdateModelValue(value, 'smoothing')"
                        inputId="smoothing" />
                    <span>
                        <label class="mb-2" for="smoothing">Smoothing Active</label>
                    </span>

                    <IconComponent :name="smoothing ? 'mdiBlur' : 'mdiBlurOff'" size="24" class="absolute right-0" />
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Smoothing Quality</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent
                                    :name="(`mdiQuality${smoothingQuality.slice(0, 1).toUpperCase() + smoothingQuality.slice(1)}` as TAnything)"
                                    size="24" />
                            </InputGroupAddon>
                            <Select v-model="smoothingQuality" :options="smoothingQualityOptions"
                                placeholder="Select a quality"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'smoothingQuality')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>
