import { type RemovableRef, useStorage } from "@vueuse/core"
import { computed } from "vue"
import storage from "./storage"

export const useSceneChange = (data?: RemovableRef<typeof storage>) => {
    let stateStorage: RemovableRef<typeof storage>

    if (data) {
        stateStorage = data
    } else {
        stateStorage = useStorage("engine", storage)
    }

    const saveChange = () => {
        const sceneIndex = stateStorage.value.scenes_open.findIndex(({ id }) => stateStorage.value.current_scene === id)

        if (sceneIndex === -1) return

        const scene = stateStorage.value.scenes_open[sceneIndex]

        if (!scene.change) return

        scene.change = false

        stateStorage.value.scenes_open[sceneIndex] = scene
    }

    const applyChange = () => {
        const sceneIndex = stateStorage.value.scenes_open.findIndex(({ id }) => stateStorage.value.current_scene === id)

        if (sceneIndex === -1) return

        const scene = stateStorage.value.scenes_open[sceneIndex]

        if (scene.change) return

        scene.change = true

        stateStorage.value.scenes_open[sceneIndex] = scene
    }

    const hasChangeScene = computed(() => {
        const scene = stateStorage.value.scenes_open.find(({ id }) => stateStorage.value.current_scene === id)

        if (!scene) return false

        return scene.change
    })

    return {
        saveChange,
        applyChange,
        hasChangeScene
    }
}