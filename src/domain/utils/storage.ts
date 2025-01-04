export default {
    project_open: null,
    scenes_open: [],
    current_scene: null,
    current_node: null,
    zoom: "100%",
    position: [0, 0],
    lockCanvas: false,
    optionCanvas: "node-selection",
    showViewport: ["show-grid", "show-axis"],
    optionDimension: "dimension-2d"
} as {
    project_open: {
        id: string
        name: string
    } | null
    scenes_open: {
        id: string
        name: string
        change: boolean
    }[]
    current_scene: null | string,
    current_node: null | string,
    zoom: string,
    position: [number, number],
    lockCanvas: boolean,
    optionCanvas: string,
    showViewport: string[]
    optionDimension: "dimension-2d" | "dimension-3d"
}