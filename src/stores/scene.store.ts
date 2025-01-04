import type { GlobalNode, Scene } from "atomic-engine-lib";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSceneStore = defineStore("scenes", () => {
    const hoverNode = ref<null | GlobalNode>(null)
    const currentNodes = ref<Record<string, boolean>>({})
    const currentScene = ref<Scene | null>(null);
    const scriptNode = ref<GlobalNode | null>(null)

    const scenes = ref<Set<{
        id: string
        name: string
    }>>(new Set())

    const referenceNode = ref<{
        node: GlobalNode | null
        type: "copy" | "cut"
    }>({
        node: null,
        type: "copy"
    })

    return {
        hoverNode,
        currentNodes,
        currentScene,
        referenceNode,
        scriptNode,
        scenes
    }
})