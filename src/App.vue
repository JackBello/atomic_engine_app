<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useStorage } from '@vueuse/core';
import { LazyStore } from '@tauri-apps/plugin-store';

import LayoutHandler from '@/layouts/layout.handler.vue';

import IconComponent from '@/components/icon.component.vue';

import { initApp, initRoot, initStore } from '@/domain/utils/store';

import storage from '@/domain/utils/storage';

import { useEngineStore } from '@/stores/engine.store';
import WindowBarComponent from './components/window-bar.component.vue';
import { useProjectStore } from './stores/project.store';

const engineStore = useEngineStore()
const projectStore = useProjectStore()

const { loading, root } = storeToRefs(engineStore)
const { store } =storeToRefs(projectStore)


onBeforeMount(async () => {
  useStorage("engine", storage)

  store.value = new LazyStore("settings.json")

  await initApp()
  await initRoot()
  await initStore(store.value as LazyStore)

  root.value = await store.value.get<string>("root")

  loading.value = false
})
</script>

<template>
  <section class="app-window-engine">
    <WindowBarComponent />
    <LayoutHandler />
    <ConfirmDialog>
      <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-col items-center p-8 bg-surface-0 dark:bg-surface-900 rounded">
          <div class="rounded-full bg-white text-black inline-flex justify-center items-center h-24 w-24 -mt-20">
            <IconComponent :name="message.icon" size="50" />
          </div>
          <span class="font-bold text-2xl block mb-2 mt-6">{{ message.header }}</span>
          <p class="mb-0">{{ message.message }}</p>
          <div class="flex items-center gap-2 mt-6">
            <Button v-bind="message.acceptProps" @click="acceptCallback"></Button>
            <Button v-bind="message.rejectProps" @click="rejectCallback"></Button>
          </div>
        </div>
      </template>
    </ConfirmDialog>
    <DynamicDialog />
    <Toast position="bottom-center" group="bc" />
    <Toast position="bottom-right" group="br" />
  </section>
</template>

<style>
.app-window-engine {
  height: 100vh;
  display: grid;
  grid-template-rows: 31px 1fr;
}
</style>