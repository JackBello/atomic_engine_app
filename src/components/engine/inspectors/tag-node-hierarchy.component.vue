<script setup lang="ts">
import { listIconNode } from '@/domain/utils/icons';

defineProps<{
    name: string
    node: string
}>()
</script>

<template>
    <section class="w-full">
        <Tag class="border-[1px] rounded-md border-zinc-700 w-full bg-zinc-800 text-white">
            <section class="w-full flex justify-center items-center gap-2 p-1">
                <img :src="listIconNode[node]" width="30" />
                <span class="text-base">
                    {{ name }}
                </span>
            </section>
        </Tag>
    </section>
</template>