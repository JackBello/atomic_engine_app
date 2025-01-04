<script setup lang="ts">
import type { GlobalNode } from 'atomic-engine-lib';
import { computed, watch } from 'vue';

import type { TAnything } from '@/types';

import IconComponent from '@/components/icon.component.vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const props = defineProps<{
    node: GlobalNode
    value: string
}>()

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

handleUpdateModelValue

watch(id, () => {
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Components</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <Button variant="outlined" label="Add component" size="small" severity="secondary">
                        <template #icon>
                            <IconComponent name="mdiPlus" />
                        </template>
                    </Button>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>