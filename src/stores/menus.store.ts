import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore('menu', () => {
    const menuNodeOptions = ref();
    const menuCanvasOptions = ref();
    const menuExplorerOptions = ref();

    return {
        menuNodeOptions,
        menuCanvasOptions,
        menuExplorerOptions
    }
})