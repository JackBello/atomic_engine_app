import { IProject } from '@/types'
import { resolve } from '@tauri-apps/api/path'
import type { LazyStore } from "@tauri-apps/plugin-store";
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
    const currentProject = ref<IProject | null>(null)
    const projects = ref<IProject[]>([])
    const store = ref<LazyStore | null>(null)

    const getPathProject = async () => {
      if (!currentProject.value)
        return {
          base: '',
          '.project': '',
          '.scenes': '',
          '.trash': '',
          '.favorites': '',
          '.packages': '',
        }

      const base = currentProject.value.path

      return {
        base,
        '.project': await resolve(base, '.project'),
        '.scenes': await resolve(base, '.scenes'),
        '.trash': await resolve(base, '.trash'),
        '.favorites': await resolve(base, '.favorites'),
        '.packages': await resolve(base, '.packages'),
      }
    }

    const getProjects = async () => {
      console.log("store", store.value);
      
      if (!store.value) return []

      const projects = await store.value.get<IProject[]>('projects')

      if (!projects) return []

      return projects
    }

    const getProject = async (id: string) => {
      if (!store.value) return undefined

      const projects = await store.value.get<IProject[]>('projects')

      if (!projects) return undefined

      return projects.find((project) => project.id === id)
    }

    const addProject = async (project: IProject) => {
      if (!store.value) return false

      const projects = await store.value.get<IProject[]>('projects')

      if (!projects) return false

      projects.push(project)

      await store.value.set('projects', projects)

      await store.value.save()

      return true
    }

    const deleteProject = async (project: IProject) => {
      if (!store.value) return false

      const projects = await store.value.get<IProject[]>('projects')

      if (!projects) return false

      const updatedProjects = projects.filter(({ id }) => project.id !== id)

      await store.value.set('projects', updatedProjects)

      await store.value.save()

      return true
    }

    const editProject = async (project: IProject) => {
      if (!store.value) return false

      const projects = await store.value.get<IProject[]>('projects')

      if (!projects) return false

      const indexProject = projects.findIndex(({ id }) => id === project.id)

      if (indexProject === -1) return false

      projects[indexProject] = project

      await store.value.set('projects', projects)

      await store.value.save()

      return true
    }
    return {
      currentProject,
      projects,
      store,
      getPathProject,
      getProjects,
      getProject,
      deleteProject,
      addProject,
      editProject,
    }
})
