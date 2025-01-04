<script setup lang="ts">
import { useEngineStore } from '@/stores/engine.store';
import IconComponent from '../icon.component.vue';
import { storeToRefs } from 'pinia';

const engineStore = useEngineStore()
const { modeEngine } = storeToRefs(engineStore)

</script>

<template>
    <section class="absolute bottom-2 left-2">
        <section class="flex flex-row items-center">
            <ButtonGroup class="mr-1">
                <Button severity="secondary" size="small"
                    class="rounded-tr-none rounded-br-none rounded-tl-full rounded-bl-full"
                    :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiMinus" />
                    </template>
                </Button>
                <Button severity="secondary" label="100%" size="small" class="cursor-auto"
                    :disabled="modeEngine === 'preview'" />
                <Button severity="secondary" size="small"
                    class="rounded-tr-full rounded-br-full rounded-tl-none rounded-bl-none"
                    :disabled="modeEngine === 'preview'">
                    <template #icon>
                        <IconComponent name="mdiPlus" />
                    </template>
                </Button>
            </ButtonGroup>
            <Button severity="secondary" class="rounded-tr-none rounded-br-none rounded-tl-full rounded-bl-full"
                size="small" :disabled="modeEngine === 'preview'">
                <template #icon>
                    <IconComponent name="mdiUndo" />
                </template>
            </Button>
            <Button severity="secondary" class="rounded-tr-full rounded-br-full rounded-tl-none rounded-bl-none"
                size="small" :disabled="modeEngine === 'preview'">
                <template #icon>
                    <IconComponent name="mdiRedo" />
                </template>
            </Button>
        </section>
    </section>
</template>