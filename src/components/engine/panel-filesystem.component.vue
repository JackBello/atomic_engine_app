<script setup lang="ts">
import { useEngineStore } from '@/stores/engine.store';
import FileExplorerComponent from '../file-explorer.component.vue';
import { storeToRefs } from 'pinia';

const { panels } = storeToRefs(useEngineStore())
</script>

<template>
    <section class="absolute bottom-2">
        <transition name="fade" mode="out-in">
            <section class="bg-zinc-900 rounded-md w-[1000px] h-[350px] p-1" v-if="panels.filesystem">
                <FileExplorerComponent />
            </section>
        </transition>
    </section>
</template>