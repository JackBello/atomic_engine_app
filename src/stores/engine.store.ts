import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { resolve } from "@tauri-apps/api/path";

import type { EngineCore } from "atomic-engine-lib";
import type { LazyStore } from "@tauri-apps/plugin-store";

import type { IProject } from "@/types";

export const useEngineStore = defineStore("engine", () => {
    const positionMouse = ref<[number, number]>([0, 0])
    const loading = ref(true);
    const engine = ref<EngineCore | null>(null)
    const currentProject = ref<IProject | null>(null)
    const projects = ref<IProject[]>([]);
    const store = ref<LazyStore | null>(null)
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

    const getPathProject = async () => {
        if (!currentProject.value) return {
            "base": "",
            ".project": "",
            ".scenes": "",
            ".trash": "",
            ".favorites": "",
            ".packages": ""
        }

        const base = currentProject.value.path;

        return {
            base,
            ".project": await resolve(base, ".project"),
            ".scenes": await resolve(base, ".scenes"),
            ".trash": await resolve(base, ".trash"),
            ".favorites": await resolve(base, ".favorites"),
            ".packages": await resolve(base, ".packages")
        }
    }

    const getProjects = async () => {
        if (!store.value) return []

        const projects = await store.value.get<IProject[]>("projects");

        if (!projects) return []

        return projects
    }

    const getProject = async (id: string) => {
        if (!store.value) return undefined

        const projects = await store.value.get<IProject[]>("projects");

        if (!projects) return undefined

        return projects.find((project) => project.id === id);
    }

    const addProject = async (project: IProject) => {
        if (!store.value) return false

        const projects = await store.value.get<IProject[]>("projects");

        if (!projects) return false

        projects.push(project)

        await store.value.set("projects", projects)

        await store.value.save()

        return true
    }

    const deleteProject = async (project: IProject) => {
        if (!store.value) return false

        const projects = await store.value.get<IProject[]>("projects");

        if (!projects) return false

        const updatedProjects = projects.filter(({ id }) => project.id !== id)

        await store.value.set("projects", updatedProjects)

        await store.value.save()

        return true
    }

    const editProject = async (project: IProject) => {
        if (!store.value) return false

        const projects = await store.value.get<IProject[]>("projects");

        if (!projects) return false

        const indexProject = projects.findIndex(({ id }) => id === project.id)

        if (indexProject === -1) return false

        projects[indexProject] = project

        await store.value.set("projects", projects)

        await store.value.save()

        return true
    }

    return {
        root,
        store,
        currentProject,
        projects,
        loading,
        engine,
        positionMouse,
        panels,
        modeEngine,
        getPathProject,
        getProjects,
        getProject,
        deleteProject,
        addProject,
        editProject
    }
})