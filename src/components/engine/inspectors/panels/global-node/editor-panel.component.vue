<script setup lang="ts">
import type { GlobalNode } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: GlobalNode
    value: string
}>()

const title = ref(props.node.title)
const description = ref(props.node.description)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

watch(id, () => {
    title.value = props.node.title
    description.value = props.node.description
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Editor</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Title</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiTextShort" size="24" />
                            </InputGroupAddon>
                            <InputText type="text" v-model="title"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'title')" />
                        </InputGroup>
                    </section>
                </section>
                <section class="flex flex-col gap-2">
                    <span class="mb-2">Description</span>
                    <section class="flex flex-col gap-2">
                        <InputGroup>
                            <InputGroupAddon>
                                <IconComponent name="mdiTextLong" size="24" />
                            </InputGroupAddon>
                            <InputText type="text" v-model="description"
                                @update:modelValue="(value) => handleUpdateModelValue(value, 'description')" />
                        </InputGroup>
                    </section>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>