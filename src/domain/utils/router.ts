import { storeToRefs } from "pinia"
import { useStorage } from "@vueuse/core"

import storage from "./storage"

import { useEngineStore } from "@/stores/engine.store"

export const isOpenProject = () => {
    const { currentProject } = storeToRefs(useEngineStore())

    return currentProject.value !== null
}

export const loadOpenProject = async () => {
    const stateStorage = useStorage("engine", storage)
    const engineStore = useEngineStore()
    const { currentProject } = storeToRefs(engineStore)
    const { getProject } = engineStore

    if (currentProject.value) return

    if (stateStorage.value.project_open) {
        const project = await getProject(stateStorage.value.project_open.id)

        if (project)
            currentProject.value = project
    }
}