<script setup lang="ts">
import IconComponent from '@/components/icon.component.vue';
import { useModalStore } from '@/stores/modal.store';
import type { Image2D, Sprite2D } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

import { useSceneChange } from '@/domain/utils/scene';

const { applyChange } = useSceneChange()

const modalStore = useModalStore()

const modal = modalStore.getModal("add_source")

const data = computed(() => modal.data)

const props = defineProps<{
    node: Image2D | Sprite2D
    value: string
}>()

const resource = ref(props.node.resource)

const id = computed(() => props.node.id);

const handleClick_openModalSource = () => {
    modalStore.openModal("add_source", {
        node: props.node
    })
}

const handleClick_removeResource = () => {
    resource.value = undefined
    props.node.removeResource()
}

watch(data, (value) => {
    if (value && 'resource' in value) {
        resource.value = value.resource
        modalStore.emptyModal("add_source")
        applyChange()
    }
})

watch(id, () => {
    resource.value = props.node.resource
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Source</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2" v-show="!resource">
                    <Button variant="outlined" label="Add Source" size="small" severity="secondary"
                        @click="handleClick_openModalSource()">
                        <template #icon>
                            <IconComponent name="mdiPlus" />
                        </template>
                    </Button>
                </section>
                <section class="flex items-center justify-between gap-2 relative" v-show="resource">
                    <section class="flex gap-2">
                        <Button variant="outlined" label="Change" size="small" severity="secondary"
                            @click="handleClick_openModalSource()">
                            <template #icon>
                                <IconComponent name="mdiReload" />
                            </template>
                        </Button>
                        <Button variant="outlined" label="Remove" size="small" severity="danger"
                            @click="handleClick_removeResource()">
                            <template #icon>
                                <IconComponent name="mdiClose" />
                            </template>
                        </Button>
                    </section>
                    <div v-html="resource?.element.outerHTML ?? ''" class="resource select-none pointer-events-none">
                    </div>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>

<style>
.resource {
    width: 60px;
    height: 60px;
}

.resource>img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}
</style>