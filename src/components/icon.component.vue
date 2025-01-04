<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import * as icons from '@mdi/js';
import { computed } from 'vue';
import type { TIcon } from '@/types';

const props = withDefaults(defineProps<{
    name: TIcon
    size?: string | number
}>(), {
    size: "16"
})

const icon = computed(() => icons[props.name])
</script>

<template>
    <svg-icon type="mdi" :path="icon" :width="size" :height="size"></svg-icon>
</template>