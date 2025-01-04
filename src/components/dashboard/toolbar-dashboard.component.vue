<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import IconComponent from '../icon.component.vue';

import { useModalStore } from '@/stores/modal.store';

const route = useRoute()
const modalStore = useModalStore()

const routeName = computed(() => route.name);

const handleClick_openNewProject = () => {
    modalStore.openModal("make_new_project")
}
</script>

<template>
    <section class="bg-zinc-900 flex justify-between p-2 relative border-b-2 border-b-zinc-700">
        <section>
            <Button severity="secondary" variant="text">
                <template #icon>
                    <IconComponent name="mdiChevronLeft" />
                </template>
            </Button>
            <Button severity="secondary" variant="text">
                <template #icon>
                    <IconComponent name="mdiChevronRight" />
                </template>
            </Button>
        </section>

        <section class="absolute left-1/2 -translate-x-1/2">
            <IconField>
                <InputIcon>
                    <IconComponent name="mdiMagnify" />
                    <i class="pi pi-search" />
                </InputIcon>
                <InputText placeholder="Search" />
            </IconField>
        </section>

        <section>
            <Button severity="secondary" variant="text" label="New project"
                v-show="routeName === 'dashboard.allProjects'" @click="handleClick_openNewProject">
                <template #icon>
                    <IconComponent name="mdiPlus" />
                </template>
            </Button>
        </section>
    </section>
</template>