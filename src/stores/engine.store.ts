import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { EngineCore } from "atomic-engine-lib";
// import type { LazyStore } from "@tauri-apps/plugin-store";

export const useEngineStore = defineStore("engine", () => {
    const positionMouse = ref<[number, number]>([0, 0])
    const loading = ref(true);
    const engine = ref<EngineCore | null>(null)
    // const store = ref<LazyStore | null>(null)
    const root = ref<string | undefined>(undefined);
    const panels = ref<{
        filesystem: boolean
        console: boolean
        debug: boolean
        audio: boolean
        animation: boolean
        shader: boolean
    }>({
        animation: false,
        audio: false,
        console: false,
        debug: false,
        filesystem: false,
        shader: false
    })

    const modeEngine = computed(() => {
        if (!engine.value) return "edition"

        return engine.value.global("mode")
    })


    return {
        root,
        // store,
        loading,
        engine,
        positionMouse,
        panels,
        modeEngine
    }
})