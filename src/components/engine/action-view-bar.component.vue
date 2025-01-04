<script setup lang="ts">
import { storeToRefs } from 'pinia';

import IconComponent from '../icon.component.vue';

import { useEngineStore } from '@/stores/engine.store';

const { panels } = storeToRefs(useEngineStore())
</script>

<template>
    <section class="absolute bottom-2 right-2">
        <ButtonGroup>
            <Button severity="secondary" @click="() => panels.filesystem = !panels.filesystem">
                <template #icon>
                    <IconComponent name="mdiFileCabinet" size="18" />
                </template>
            </Button>
            <Button severity="secondary">
                <template #icon>
                    <IconComponent name="mdiConsole" size="18" />
                </template>
            </Button>
            <Button severity="secondary">
                <template #icon>
                    <IconComponent name="mdiDebugStepOver" size="18" />
                </template>
            </Button>
            <Button severity="secondary">
                <template #icon>
                    <IconComponent name="mdiAudioInputRca" size="18" />
                </template>
            </Button>
            <Button severity="secondary">
                <template #icon>
                    <IconComponent name="mdiMovieRoll" size="18" />
                </template>
            </Button>
            <Button severity="secondary">
                <template #icon>
                    <IconComponent name="mdiAutoFix" size="18" />
                </template>
            </Button>
        </ButtonGroup>
    </section>
</template>