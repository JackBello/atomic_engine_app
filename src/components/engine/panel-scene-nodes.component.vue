<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { CanvasNode, type GlobalNode } from "atomic-engine-lib";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue";

import type { TAnything } from "@/types";

import IconComponent from "../icon.component.vue";

import { listIconNode } from "@/domain/utils/icons";
import { useSceneChange } from "@/domain/utils/scene";

import { useSceneStore } from "@/stores/scene.store";
import { useModalStore } from "@/stores/modal.store";
import { useEngineStore } from "@/stores/engine.store";
import { useMenuStore } from "@/stores/menus.store";
import ContextMenuBasicComponent from "../context-menu-basic.component.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const confirmDialog = useConfirm();
const engineStore = useEngineStore();
const { currentScene, currentNodes, scriptNode, referenceNode } = storeToRefs(
    useSceneStore(),
);
const { engine, modeEngine } = storeToRefs(engineStore);
const modalStore = useModalStore();
const { menuNodeOptions } = storeToRefs(useMenuStore());
const { applyChange } = useSceneChange();

type TNodeTree = {
    key: string;
    label: string;
    data: string;
    children: TNodeTree[];
    options: {
        type: string;
        visible: boolean;
        lock: boolean;
        script: boolean;
        object: boolean;
    };
};

const mapNode = (node: GlobalNode): TNodeTree => {
    return {
        key: node.path.replace("/", "-"),
        label: node.slug,
        data: node.id,
        children: node.wrap ? [] : node.$nodes.all.map(mapNode),
        options: {
            type: node.NODE_NAME,
            visible: node.visible,
            lock: node.lock,
            script: node.$script.source !== null,
            object: node.wrap,
        },
    };
};

const nodes = computed<TNodeTree[]>(() =>
    (currentScene.value?.$nodes.all ?? []).map(mapNode as TAnything),
);

const nodeOptions = ref([
    {
        show: true,
        label: "Add Child Node",
        icon: "mdiPlus",
        command: () => {
            modalStore.openModal("add_node", {
                path: Object.keys(currentNodes.value)[0].replace("-", "/"),
            });
        },
    },
    {
        show: true,
        label: "Instance Child Node",
        icon: "mdiCube",
        command: () => {
            modalStore.openModal("add_instance_node", {
                path: Object.keys(currentNodes.value)[0].replace("-", "/"),
            });
        }
    },
    {
        show: true,
        label: "Attach Script",
        icon: "mdiScriptText",
        command: () => handleClick_addScriptNode()
    },
    { separator: true },
    {
        show: true,
        label: "Copy",
        icon: "mdiContentCopy",
        command: async () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const search = engine.value.ROOT.getNodeByPath(path, "index");

            if (!search) return;

            const clone = await search.clone();

            referenceNode.value = {
                node: clone,
                type: "copy",
            };

            nodeOptions.value[6].show = true;
        },
    },
    {
        show: true,
        label: "Cut",
        icon: "mdiContentCut",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const search = engine.value.ROOT.getNodeByPath(path, "index");

            if (!search) return;

            engine.value.ROOT.deleteNodeByPath(path, 'index')

            referenceNode.value = {
                node: search,
                type: 'cut'
            }

            nodeOptions.value[6].show = true;
        },
    },
    {
        show: false,
        label: "Paste",
        icon: "mdiContentPaste",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const search = engine.value.ROOT.getNodeByPath(path, "index");

            if (!search) return;

            search.$nodes.add(referenceNode.value.node as GlobalNode);

            referenceNode.value = {
                node: null,
                type: "copy",
            };

            nodeOptions.value[6].show = false;
        },
    },
    { separator: true },
    {
        show: true,
        label: "Rename",
        icon: "mdiCursorText"
    },
    {
        show: true,
        label: "Change Type",
        icon: "mdiCubeOutline"
    },
    { separator: true },
    {
        show: true,
        label: "Move Parent",
        icon: "mdiArrowTopLeft",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const hasOldPath = engine.value.ROOT.hasNodeByPath(path, "index");

            const parent = engine.value.ROOT.getParentNodeByPath(path, "index");

            if (!parent) return;
            if (parent.NODE_NAME === "Scene") return;
            if (!hasOldPath) return;

            engine.value.ROOT.moveNodeByPath(
                {
                    mode: "index",
                    search: path,
                },
                {
                    mode: "index",
                    search: parent.path,
                },
                "after",
            );

            const object: Record<string, boolean> = {};
            object[parent.path.replace("/", "-")] = true;

            currentNodes.value = object;

            applyChange();
        },
    },
    {
        show: true,
        label: "Move To Bottom",
        icon: "mdiChevronDoubleUp",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const hasOldPath = engine.value.ROOT.hasNodeByPath(path, "index");

            if (!hasOldPath) return;

            const newPath = engine.value.ROOT.getNodeByPath(path, "index")?.first?.path;

            if (!newPath) return;

            if (path === newPath) return;

            engine.value.ROOT.moveNodeByPath(
                {
                    mode: "index",
                    search: path,
                },
                {
                    mode: "index",
                    search: newPath,
                },
            );

            const object: Record<string, boolean> = {};
            object[newPath.replace("/", "-")] = true;

            currentNodes.value = object;

            applyChange();
        },
    },
    {
        show: true,
        label: "Move Up",
        icon: "mdiChevronUp",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const hasOldPath = engine.value.ROOT.hasNodeByPath(path, "index");

            if (!hasOldPath) return;

            const newPath = `${path.slice(0, path.lastIndexOf("/"))}/${Number(path.split("/").at(-1)) - 1}`;
            const hasNewPath = engine.value.ROOT.hasNodeByPath(newPath, "index");

            if (!hasNewPath) return;

            engine.value.ROOT.moveNodeByPath(
                {
                    mode: "index",
                    search: path,
                },
                {
                    mode: "index",
                    search: newPath,
                },
            );

            const object: Record<string, boolean> = {};
            object[newPath.replace("/", "-")] = true;

            currentNodes.value = object;

            applyChange();
        },
    },
    {
        show: true,
        label: "Move Down",
        icon: "mdiChevronDown",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const hasOldPath = engine.value.ROOT.hasNodeByPath(path, "index");

            if (!hasOldPath) return;

            const newPath = `${path.slice(0, path.lastIndexOf("/"))}/${Number(path.split("/").at(-1)) + 1}`;
            const hasNewPath = engine.value.ROOT.hasNodeByPath(newPath, "index");

            if (!hasNewPath) return;

            engine.value.ROOT.moveNodeByPath(
                {
                    mode: "index",
                    search: path,
                },
                {
                    mode: "index",
                    search: newPath,
                },
            );

            const object: Record<string, boolean> = {};
            object[newPath.replace("/", "-")] = true;

            currentNodes.value = object;

            applyChange();
        },
    },
    {
        show: true,
        label: "Move To Front",
        icon: "mdiChevronDoubleDown",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const hasOldPath = engine.value.ROOT.hasNodeByPath(path, "index");

            if (!hasOldPath) return;

            const newPath = engine.value.ROOT.getNodeByPath(path, "index")?.last?.path;

            if (!newPath) return;

            if (path === newPath) return;

            engine.value.ROOT.moveNodeByPath(
                {
                    mode: "index",
                    search: path,
                },
                {
                    mode: "index",
                    search: newPath,
                },
            );

            const object: Record<string, boolean> = {};
            object[newPath.replace("/", "-")] = true;

            currentNodes.value = object;

            applyChange();
        },
    },
    {
        show: true,
        label: "Duplicate",
        icon: "mdiContentDuplicate",
        command: async () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const parent = engine.value.ROOT.getParentNodeByPath(path, "index");

            const search = engine.value.ROOT.getNodeByPath(path, "index");

            if (!search) return;
            if (!parent) return;

            const clone = await search.clone();

            parent.$nodes.add(clone);

            applyChange();
        },
    },
    { separator: true },
    {
        show: true,
        label: "Save Instance Node",
        icon: "mdiContentSave",
        command: () => {
            if (!engine.value) return;

            const path = Object.keys(currentNodes.value)[0].replace("-", "/");

            const node = engine.value.ROOT.getNodeByPath(path, "index");

            if (!node) return

            modalStore.openModal("save_instance_node", {
                node
            })
        }
    },
    { separator: true },
    {
        show: true,
        label: "Delete Node",
        icon: "mdiDelete",
        command: () => handleClick_deleteSelectNode(),
    },
]);

const handleDrop = (event: DragEvent, key: string) => {
    event.preventDefault();

    if (!engine.value) return;

    const to = key.replace("-", "/");
    const from = event.dataTransfer?.getData("text/plain");

    if (!from) return;
    if (to === from) return;

    engine.value.ROOT.moveNodeByPath(
        {
            mode: "index",
            search: from,
        },
        {
            mode: "index",
            search: to,
        },
    );
};

const handleDragStart = (event: DragEvent, key: string) => {
    event.dataTransfer?.setData("text/plain", key.replace("-", "/"));
    // const object: Record<string, boolean> = {};
    // object[key] = true;
    // currentNodes.value = object;
};

const handleClick_openMenuNodeOptions = (event: MouseEvent, path: string) => {
    if (menuNodeOptions.value && modeEngine.value !== "preview") {
        const object: Record<string, boolean> = {};
        object[path] = true;
        menuNodeOptions.value.show(event);
        currentNodes.value = object;
    }
};

const handleClick_addNode = () => {
    modalStore.openModal("add_node");
};

const handleClick_addInstanceNode = () => {
    modalStore.openModal("add_instance_node");
};

const handleClick_addScriptNode = () => {
    if (!engine.value) return;

    const path = Object.keys(currentNodes.value)[0].replace("-", "/");

    const node = engine.value.ROOT.getNodeByPath(path, "index");

    if (!node) return

    if (node.$script.source !== null) {
        toast.add({
            severity: "warn",
            summary: "Attach script",
            detail: "This node already has a script attached",
            life: 3000,
            group: "br",
        });
        return;
    }

    modalStore.openModal("make_script_node", {
        node
    })
}

const handleClick_deleteSelectNode = () => {
    if (!engine.value) return;

    const path = Object.keys(currentNodes.value)[0].replace("-", "/");

    const search = engine.value.ROOT.getNodeByPath(path, "index");

    if (!search) return;

    confirmDialog.require({
        message: `Are you sure you want to delete this '${search.slug}' node?`,
        header: "Danger zone",
        icon: "mdiDelete",
        rejectProps: {
            label: "Cancel",
            severity: "secondary",
            outlined: true,
        },
        acceptProps: {
            label: "Confirm",
            severity: "success",
        },
        accept: () => {
            if (!engine.value) return;

            engine.value.ROOT.deleteNodeByPath(path, "index");

            currentNodes.value = {};

            toast.add({
                severity: "success",
                summary: "Delete node",
                detail: "The node has been successfully removed",
                life: 3000,
                group: "br",
            });

            applyChange();
        },
    });
};

const handleClick_openScript = (path: string) => {
    if (!engine.value) return;

    const search = path.replace("-", "/");

    const node = engine.value.ROOT.getNodeByPath(search, "index");

    if (!node) return;

    if (node.$script.source === null) {
        toast.add({
            severity: "warn",
            summary: "Attach script",
            detail: "This node does not have a script attached",
            life: 3000,
            group: "br",
        });

        return
    }

    scriptNode.value = node;

    router.push({
        name: "engine.code",
    });
};

const handleClick_toggleVisibleNode = (path: string) => {
    if (!engine.value) return;

    const search = path.replace("-", "/");

    const node = engine.value.ROOT.getNodeByPath(search, "index");

    if (!node) return;

    if (node instanceof CanvasNode) {
        node.visible = !node.visible;
    }

    applyChange();
};

const handleClick_toggleLockNode = (path: string) => {
    if (!engine.value) return;

    const search = path.replace("-", "/");

    const node = engine.value.ROOT.getNodeByPath(search, "index");

    if (!node) return;

    if (node instanceof CanvasNode) {
        node.lock = !node.lock;
        node.hovered = !node.hovered;
    }

    applyChange();
};
</script>

<template>
    <section class="absolute left-2 top-[52px]">
        <transition name="fade" mode="out-in">
            <Panel header="Nodes" toggleable class="max-w-96 w-96 panel-scene-nodes" v-show="currentScene !== null">
                <Tree v-model:selectionKeys="currentNodes" :value="nodes" :filter="true" filterMode="strict"
                    selectionMode="multiple" :metaKeySelection="true" class="p-0 tree-scene-nodes">
                    <template #header>
                        <section class="flex justify-between mb-2">
                            <section class="flex">
                                <Button severity="secondary" variant="text" @click="handleClick_addNode()"
                                    :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiPlus" size="18" />
                                    </template>
                                </Button>
                                <Button severity="secondary" variant="text" @click="handleClick_addInstanceNode()"
                                    :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiCube" size="18" />
                                    </template>
                                </Button>
                                <Button severity="secondary" variant="text" @click="handleClick_addScriptNode()"
                                    v-show="Object.keys(currentNodes).length > 0" :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiScriptText" size="18" />
                                    </template>
                                </Button>
                                <Button severity="secondary" variant="text" @click="handleClick_deleteSelectNode()"
                                    v-show="Object.keys(currentNodes).length > 0" :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiDelete" size="18" />
                                    </template>
                                </Button>
                            </section>

                            <section>
                                <Button severity="secondary" variant="text">
                                    <template #icon>
                                        <IconComponent name="mdiDotsVertical" size="18" />
                                    </template>
                                </Button>
                            </section>
                        </section>
                    </template>
                    <template #default="{ node }">
                        <section class="flex items-center justify-between w-full gap-2 select-none"
                            @contextmenu="(event) => handleClick_openMenuNodeOptions(event, node.key)"
                            @dragstart="handleDragStart($event, node.key)" @drop="handleDrop($event, node.key)"
                            @dragover.prevent draggable="true">
                            <section class="flex items-center">
                                <img :src="listIconNode[node.options.type]" width="26" class="mr-1" />
                                <span class="max-w-[120px] truncate text-sm">
                                    {{ node.label }}
                                </span>
                            </section>
                            <section>
                                <Button severity="secondary" text class="px-0 w-[36px]" size="small"
                                    v-show="node.options.object" :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiCube" />
                                    </template>
                                </Button>
                                <Button severity="secondary" text class="px-0 w-[36px]" size="small"
                                    v-show="node.options.script" @click="handleClick_openScript(node.key)"
                                    :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent name="mdiScript" />
                                    </template>
                                </Button>
                                <Button severity="secondary" text class="px-0 w-[36px]" size="small"
                                    @click="handleClick_toggleVisibleNode(node.key)"
                                    v-show="node.options.type !== 'GlobalNode'" :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent :name="node.options.visible ? 'mdiEye' : 'mdiEyeOff'" />
                                    </template>
                                </Button>
                                <Button severity="secondary" text class="px-0 w-[36px]" size="small"
                                    @click="handleClick_toggleLockNode(node.key)"
                                    v-show="node.options.type !== 'GlobalNode'" :disabled="modeEngine === 'preview'">
                                    <template #icon>
                                        <IconComponent :name="node.options.lock ? 'mdiLock' : 'mdiLockOpen'" />
                                    </template>
                                </Button>
                            </section>
                        </section>
                    </template>
                    <template #footer>
                        <section class="mt-2">
                            {{ nodes.length }} nodes in the scene
                        </section>
                    </template>
                </Tree>
                <ContextMenuBasicComponent :options="nodeOptions" @load="(value) => menuNodeOptions = value" />
            </Panel>
        </transition>
    </section>
</template>

<style>
.panel-scene-nodes .p-panel-content {
    padding: 10px;
    color: #404040;
}

.panel-scene-nodes .p-panel-header {
    padding-left: 10px;
    padding-right: 10px;
}

.tree-scene-nodes .p-tree-node-content {
    padding: 4px;
}

.tree-scene-nodes .p-tree-node-label {
    display: block;
    flex: 1 1 auto;
}
</style>