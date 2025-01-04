import { defineStore } from "pinia"
import { ref } from "vue";

import type { TAnything } from "@/types";

export const useModalStore = defineStore("modal", () => {
    const modals = ref<Record<string, { data: TAnything, active: boolean }>>({
        add_scene: {
            active: false,
            data: null
        },
        add_node: {
            active: false,
            data: null
        },
        add_source: {
            active: false,
            data: null
        },
        add_folder: {
            active: false,
            data: null
        },
        add_file: {
            active: false,
            data: null
        },
        add_instance_node: {
            active: false,
            data: null
        },
        add_script_node: {
            active: false,
            data: null
        },
        make_script_node: {
            active: false,
            data: null
        },
        save_instance_node: {
            active: false,
            data: null
        },
        file_preview: {
            active: false,
            data: null
        },
        file_explorer: {
            active: false,
            data: null
        },
        scenes: {
            active: false,
            data: null
        },
        make_new_project: {
            active: false,
            data: null
        },
    })

    const getModal = <T = TAnything>(name: string): { data: T, active: boolean } => {
        if (!hasModal(name)) throw new Error(`this '${name}' modal not exist`)

        return modals.value[name]
    }

    const hasModal = (name: string) => {
        return !!modals.value[name]
    }

    const addDataModal = (name: string, data: TAnything) => {
        const modal = getModal(name)
        modal.data = data
    }

    const openModal = (name: string, data: TAnything = null) => {
        const modal = getModal(name)

        modal.active = true
        modal.data = data
    }

    const closeModal = (name: string) => {
        const modal = getModal(name)

        modal.active = false
        modal.data = null
    }

    const toggleModal = (name: string) => {
        const modal = getModal(name)

        modal.active = !modal.active
    }

    const emptyModal = (name: string) => {
        const modal = getModal(name)

        modal.data = null
    }

    return {
        getModal,
        hasModal,
        openModal,
        closeModal,
        toggleModal,
        emptyModal,
        addDataModal
    }
})