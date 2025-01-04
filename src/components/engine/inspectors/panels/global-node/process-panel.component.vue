<script setup lang="ts">
import type { GlobalNode } from 'atomic-engine-lib';
import { computed, ref, watch } from 'vue';

import type { TAnything } from '@/types';
import { useSceneChange } from '@/domain/utils/scene';
import IconComponent from '@/components/icon.component.vue';
import { useModalStore } from '@/stores/modal.store';

const { applyChange } = useSceneChange()

const modalStore = useModalStore()

const dataAddScriptNode = computed(() => modalStore.getModal("add_script_node").data)

const props = defineProps<{
    node: GlobalNode
    value: string
}>()

const source = ref(props.node.$script.source)

const id = computed(() => props.node.id)

const handleUpdateModelValue = (value: TAnything, prop: string) => {
    props.node[prop] = value

    applyChange()
}

const handleClick_addScript = () => {
    modalStore.openModal("add_script_node")
}

const handleClick_removeScript = () => {
    source.value = null
    props.node.$script.removeScript()
    applyChange()
}

handleUpdateModelValue

watch(dataAddScriptNode, (value) => {
    if (!value) return

    if (!value.script_path) return

    source.value = new URL(value.script_path)
    props.node.$script.defineScript(new URL(value.script_path))
    applyChange()
})

watch(id, () => {
    source.value = props.node.$script.source
})
</script>

<template>
    <AccordionPanel :value="value">
        <AccordionHeader>Process</AccordionHeader>
        <AccordionContent>
            <section class="flex flex-col gap-3">
                <section class="flex flex-col gap-2">
                    <Button variant="outlined" label="Attach script" size="small" severity="secondary"
                        v-show="source === null" @click="handleClick_addScript()">
                        <template #icon>
                            <IconComponent name="mdiPlus" />
                        </template>
                    </Button>

                    <InputGroup v-if="typeof source !== 'string' && source !== null">
                        <InputGroupAddon>
                            <IconComponent name="mdiScript" />
                        </InputGroupAddon>
                        <InputText :value="source.pathname.split('/').pop()"
                            @input="handleUpdateModelValue($event, '$script.source')" readonly disabled />
                        <InputGroupAddon>
                            <Button text severity="danger" size="small" @click="handleClick_removeScript()">
                                <IconComponent name="mdiClose" />
                            </Button>
                        </InputGroupAddon>
                        <InputGroupAddon>
                            <Button text severity="secondary" size="small">
                                <IconComponent name="mdiDotsVertical" />
                            </Button>
                        </InputGroupAddon>
                    </InputGroup>
                </section>
            </section>
        </AccordionContent>
    </AccordionPanel>
</template>