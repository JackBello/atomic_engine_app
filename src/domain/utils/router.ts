import { storeToRefs } from "pinia"
import { useStorage } from "@vueuse/core"

import storage from "./storage"

import { useProjectStore } from "@/stores/project.store"

export const isOpenProject = () => {
    const { currentProject } = storeToRefs(useProjectStore())

    return currentProject.value !== null
}

export const loadOpenProject = async () => {
    const stateStorage = useStorage("engine", storage)
    const projectStore = useProjectStore()
    const { currentProject } = storeToRefs(projectStore)
    const { getProject } = projectStore

    if (currentProject.value) return

    if (stateStorage.value.project_open) {
        const project = await getProject(stateStorage.value.project_open.id)

        if (project)
            currentProject.value = project
    }
}