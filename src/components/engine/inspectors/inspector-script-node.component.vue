<script setup lang="ts">
import type { GlobalNode } from 'atomic-engine-lib';

import TagNodeHierarchyComponent from './tag-node-hierarchy.component.vue';
import { InputNumber, InputText } from 'primevue';
import type { TAnything } from '@/types';

const props = defineProps<{
    node: GlobalNode
}>()

const components: Record<string, TAnything> = {
    "number": InputNumber,
    "text": InputText
}

const handleUpdateModelValue = (value: TAnything, key: string) => {
    const attribute = props.node.$attributes.get(key);

    if (!attribute) return;

    attribute.value = value;

    props.node.$attributes.change(key, attribute);
}
</script>

<template>
    <section class="flex flex-col items-center">
        <TagNodeHierarchyComponent name="Script Node" node="ScriptNode" />
        <section class="flex flex-col w-full mt-2 gap-2">
            <section v-for="([name, attribute], key) in node.$attributes.toEntries()" :key="key" class="grid"
                style="grid-template-columns: 1fr 2fr;">
                <label class="font-bold flex justify-center items-center" :for="name">{{ attribute.label }}</label>
                <section>
                    <component :is="components[attribute.input]" v-model="attribute.value" :inputId="name"
                        @input="(event: TAnything) => handleUpdateModelValue(event.value, name)" />
                </section>
            </section>
        </section>
    </section>
</template>
