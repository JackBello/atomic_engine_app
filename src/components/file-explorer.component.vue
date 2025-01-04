<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';

import { useEngineStore } from '@/stores/engine.store';
import { storeToRefs } from 'pinia';
import { BaseDirectory, copyFile, remove } from '@tauri-apps/plugin-fs';
import { basename, dirname } from '@tauri-apps/api/path';
import type { TAnything, TFileElement } from '@/types';
import IconComponent from './icon.component.vue';
import { useModalStore } from '@/stores/modal.store';
import { useToast } from 'primevue';
import { useConfirm } from 'primevue/useconfirm';
import { copyDirectory, createURLBase64, readFolder, validateFilter } from '@/domain/utils/fs';
import { open } from '@tauri-apps/plugin-dialog';
import ContextMenuBasicComponent from './context-menu-basic.component.vue';
import { useMenuStore } from '@/stores/menus.store';

const props = withDefaults(defineProps<{
    filter?: TFileElement['format'] | string[]
    filterKind?: "file" | "folder" | "all"
    multiple?: boolean
    showMenuElement?: boolean
    showMenuSystem?: boolean
    showThree?: boolean
    directory?: string
    height?: number
}>(), {
    showMenuElement: true,
    showMenuSystem: true,
    showThree: true,
    height: 250,
    filterKind: "all"
})

const emits = defineEmits<{
    select: [element: TFileElement | null]
    changeDirectory: [elements: TFileElement[]]
    changePath: [path: string]
    load: [elements: TFileElement[]]
}>()

const toast = useToast()
const confirmDialog = useConfirm()
const engineStore = useEngineStore()
const { currentProject } = storeToRefs(engineStore)
const modalStore = useModalStore()
const { menuExplorerOptions } = storeToRefs(useMenuStore())

const modalFolder = modalStore.getModal("add_folder")
const dataFolder = computed(() => modalFolder.data)

const modalFile = modalStore.getModal("add_file")
const dataFile = computed(() => modalFile.data)

const folderHidden = ref<boolean>(false)

const history = ref<{
    previous: string[]
    current: string
    next: string[]
}>({
    previous: [],
    current: '',
    next: []
})

const elementAction = ref<{
    type: "copy" | "cut"
    element: TFileElement | null
}>({
    type: "copy",
    element: null
})

const baseProject = ref<string>('')

const optionsThree = ref<{
    key: string
    label: string
    icon: string
    children?: TAnything[]
    loading?: boolean
    leaf?: boolean
    options: Record<string, TAnything>
}[]>([
    {
        key: "0",
        icon: "mdiStar",
        label: "Favorites",
        options: {
            path: ".favorites"
        }
    },
    {
        key: "1",
        icon: "mdiFolderHome",
        label: "Sources",
        children: [],
        options: {
            path: "/"
        }
    },
    {
        key: "2",
        icon: "mdiTrashCan",
        label: "Trash",
        options: {
            path: ".trash"
        }
    },
    {
        key: "3",
        icon: "mdiPackage",
        label: "Packages",
        options: {
            path: ".packages"
        }
    }
])

const optionsFileSystem = ref([
    {
        icon: 'mdiContentPaste',
        label: 'Paste',
        show: false,
        command: async () => {
            if (elementAction.value.type === "copy" && elementAction.value.element) {
                const basenamePath = await basename(elementAction.value.element.path)
                const newPath = `${history.value.current}/${basenamePath}`

                if (elementAction.value.element.kind === 'folder') {
                    await copyDirectory(elementAction.value.element.path, newPath);
                } else {
                    await copyFile(elementAction.value.element.path, newPath, {
                        fromPathBaseDir: BaseDirectory.AppData,
                        toPathBaseDir: BaseDirectory.AppData,
                    });
                }

                elementAction.value = {
                    type: "copy",
                    element: null
                }
            }

            if (elementAction.value.type === "cut" && elementAction.value.element) {
                const basenamePath = await basename(elementAction.value.element.path)
                const newPath = `${history.value.current}/${basenamePath}`

                await copyFile(elementAction.value.element.path, newPath, {
                    fromPathBaseDir: BaseDirectory.AppData,
                    toPathBaseDir: BaseDirectory.AppData,
                });

                await remove(elementAction.value.element.path, {
                    baseDir: BaseDirectory.AppData,
                    recursive: true
                })

                elementAction.value = {
                    type: "copy",
                    element: null
                }
            }

            optionsFileSystem.value[0].show = false

            await handleClick_refresh()
            await refreshThree()
        }
    },
    {
        icon: 'mdiAttachment',
        label: 'Add File',
        show: true,
        command: async () => {
            const paths = await open({
                multiple: true,
                directory: false
            })

            if (!paths) return
            if (!paths.length) return

            for (const path of paths) {
                const basenamePath = await basename(path)
                const newPath = `${history.value.current}/${basenamePath}`

                await copyFile(path, newPath, {
                    fromPathBaseDir: BaseDirectory.Home,
                    toPathBaseDir: BaseDirectory.AppData,
                });
            }

            await handleClick_refresh()
            await refreshThree()
        }
    },
    {
        icon: 'mdiAttachment',
        label: 'Add Folder',
        show: true,
        command: async () => {
            const paths = await open({
                multiple: true,
                directory: true
            })

            if (!paths) return
            if (!paths.length) return

            for (const path of paths) {
                const basenamePath = await basename(path)
                const newPath = `${history.value.current}/${basenamePath}`

                await copyDirectory(path, newPath);
            }

            await handleClick_refresh()
            await refreshThree()
        }
    },
    {
        icon: "mdiFilePlus",
        label: 'New File',
        show: true,
        command: () => {
            modalStore.openModal('add_file', {
                path: history.value.current
            })
        }
    },
    {
        icon: 'mdiFolderPlus',
        label: 'New Folder',
        show: true,
        command: () => {
            modalStore.openModal('add_folder', {
                path: history.value.current
            })
        }
    },
    {
        icon: 'mdiRefresh',
        label: 'Refresh',
        show: true,
        command: async () => await handleClick_refresh()
    },
    {
        icon: 'mdiFolderHidden',
        label: 'Show Hidden Files',
        show: true,
        command: async () => {
            folderHidden.value = !folderHidden.value
            await handleClick_refresh()
            await refreshThree()
        }
    }
])

const optionsElement = [
    {
        icon: 'mdiContentCopy',
        label: 'Copy',
        show: true,
        command: () => {
            elementAction.value = {
                type: 'copy',
                element: selectElement.value
            }
            optionsFileSystem.value[0].show = true
        }
    },
    {
        icon: 'mdiContentCut',
        label: 'Cut',
        show: true,
        command: () => {
            elementAction.value = {
                type: 'cut',
                element: selectElement.value
            }
            optionsFileSystem.value[0].show = true
        }
    },
    {
        icon: 'mdiDelete',
        label: 'Delete',
        show: true,
        command: () => {
            confirmDialog.require({
                message: "Are you sure you want to delete this file?",
                header: 'Danger Zone',
                icon: 'mdiDelete',
                rejectProps: {
                    label: 'Cancel',
                    severity: 'secondary',
                    outlined: true
                },
                acceptProps: {
                    label: 'Confirm',
                    severity: 'success'
                },
                accept: async () => {
                    if (!selectElement.value) return

                    await remove(selectElement.value.path, {
                        baseDir: BaseDirectory.AppData,
                        recursive: true
                    })

                    elements.value.delete(selectElement.value.name)
                    await refreshThree()

                    emits("changeDirectory", elementsShort.value)
                    selectElement.value = null
                    emits("select", null)

                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'File deleted successfully',
                        life: 3000,
                        group: "br"
                    })
                },
            });
        }
    },
]

const optionsExplorer = ref<TAnything[]>([])

const elementExclude = ['.project', '.scenes', '.favorites', '.trash', '.packages', '.git', '.gitignore', '.gitattributes', '.gitmodules', '.gitkeep']

const elements = ref<Map<string, TFileElement>>(new Map())

const elementsShort = computed(() =>
    [...elements.value.values()].sort((a, b) => {
        if (a.kind === 'folder' && b.kind === 'file') return -1
        if (a.kind === 'file' && b.kind === 'folder') return 1

        return a.name.localeCompare(b.name)
    }))

const options = [
    {
        value: "list",
        icon: 'mdiViewList'
    },
    {
        value: 'grid',
        icon: 'mdiViewGrid'
    }
]

const layout = ref<"list" | "grid">("grid")

const selectElement = ref<TFileElement | null>(null)
const selectElementThree = ref<Record<string, boolean>>({})

const openFolder = async (dirPath: string) => {
    const content = await readFolder(dirPath)

    elements.value.clear()

    for (const element of content) {
        if (!folderHidden.value && elementExclude.includes(element.name)) continue

        if (props.filterKind === 'file' && element.kind === 'folder') continue
        if (props.filterKind === 'folder' && element.kind === 'file') continue

        if (element.ext && !validateFilter(element.ext, props.filter)) continue

        if (element.ext) {

            if (element.format === 'image') {
                element.loading = true

                createURLBase64(element.path, element.ext).then((url) => {
                    const _element = elements.value.get(element.name)
                    if (_element) {
                        _element.preview = url
                        _element.loading = false
                        elements.value.set(element.name, _element)
                    }
                })
            }
        }

        elements.value.set(element.name, element)
    }
}

const initSystem = async () => {
    if (!currentProject.value) return

    if (props.directory) {
        await openFolder(props.directory)
        baseProject.value = props.directory
        history.value.current = props.directory
        return
    }

    await openFolder(currentProject.value.path)

    baseProject.value = currentProject.value.path
    history.value.current = currentProject.value.path
}

const refreshThree = async () => {
    const content = (await readFolder(baseProject.value)).filter(({ name }) => !elementExclude.includes(name)).sort((a, b) => {
        if (a.kind === 'folder' && b.kind === 'file') return -1
        if (a.kind === 'file' && b.kind === 'folder') return 1

        return a.name.localeCompare(b.name)
    })

    optionsThree.value[1].children = content.map(({ name, kind, path, preview }, index) => ({
        key: `1-${index}`,
        label: name,
        icon: preview && URL.canParse(preview) ? 'mdiFileImage' : preview,
        loading: false,
        leaf: kind === 'file',
        options: {
            path
        }
    }))
}

const urlCanParse = (url: string) => URL.canParse(url)

const handleDrop = async (event: DragEvent, element: TFileElement) => {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer?.getData('application/json') || '{}') as TFileElement

    if (data.kind === 'file') {
        const basenamePath = await basename(data.path)
        const newPath = `${element.path}/${basenamePath}`

        await copyFile(data.path, newPath, {
            fromPathBaseDir: BaseDirectory.AppData,
            toPathBaseDir: BaseDirectory.AppData,
        });

        await remove(data.path, {
            baseDir: BaseDirectory.AppData,
            recursive: true
        })

        elements.value.delete(data.name)
        await handleClick_refresh()
        await refreshThree()
    }

    if (data.kind === 'folder') {
        const basenamePath = await basename(data.path)
        const newPath = `${element.path}/${basenamePath}`

        await copyDirectory(data.path, newPath);

        await remove(data.path, {
            baseDir: BaseDirectory.AppData,
            recursive: true
        })

        elements.value.delete(data.name)
        await handleClick_refresh()
        await refreshThree()
    }
}

const handleDragend = (event: DragEvent) => {
    const target = event.target as HTMLElement

    target.style.opacity = '1'
}

const handleDragstart = (event: DragEvent, element: TFileElement) => {
    selectElement.value = element
    emits("select", element)

    if (event.dataTransfer) {
        const target = event.target as HTMLElement

        target.style.opacity = '0.4'

        event.dataTransfer.setData('application/json', JSON.stringify(element));
    }
}

const handleClick_select = (element: TFileElement | null) => {
    selectElement.value = element
    emits("select", element)
}

const handleClick_open = async (element: TFileElement) => {
    if (element.kind === 'folder') {
        history.value.previous.push(history.value.current)
        history.value.current = element.path
        await openFolder(element.path)
        emits("changeDirectory", elementsShort.value)
        emits("changePath", history.value.current)
    } else {
        modalStore.openModal('file_preview', {
            element
        })
    }
}

const handleClick_contextMenuFileSystem = (event: MouseEvent) => {
    if (props.showMenuSystem && menuExplorerOptions.value) {
        selectElement.value = null
        emits("select", null)
        optionsExplorer.value = optionsFileSystem.value
        menuExplorerOptions.value.show(event)
    }
}

const handleClick_contextMenuElement = (event: MouseEvent, element: TFileElement) => {
    if (props.showMenuElement && menuExplorerOptions.value) {
        optionsExplorer.value = optionsElement
        selectElement.value = element
        emits("select", element)
        menuExplorerOptions.value.show(event)
    }
}

const handleClick_home = async () => {
    history.value.previous.push(history.value.current)
    history.value.current = baseProject.value
    await openFolder(baseProject.value)
    emits("changeDirectory", elementsShort.value)
    emits("changePath", history.value.current)
}

const handleClick_refresh = async () => {
    await openFolder(history.value.current)
    emits("changeDirectory", elementsShort.value)
}

const handleClick_back = async () => {
    if (history.value.previous.length) {
        const path = history.value.previous.pop()

        if (path) {
            await openFolder(path)
            history.value.next.push(history.value.current)
            history.value.current = path
            emits("changeDirectory", elementsShort.value)
            emits("changePath", history.value.current)
        }
    }
}

const handleClick_next = async () => {
    if (history.value.next.length) {
        const path = history.value.next.pop()

        if (path) {
            await openFolder(path)
            history.value.previous.push(history.value.current)
            history.value.current = path
            emits("changeDirectory", elementsShort.value)
            emits("changePath", history.value.current)
        }
    }
}

const handleClick_top = async () => {
    if (history.value.current !== baseProject.value) {
        const path = await dirname(history.value.current)

        await openFolder(path)

        history.value.previous.push(history.value.current)
        history.value.current = baseProject.value
        emits("changeDirectory", elementsShort.value)
        emits("changePath", history.value.current)
    }
}

const handleNodeExpand_loadContentFolder = async (node: TAnything) => {
    if (node.options.path === undefined) return

    if (node.children) return

    node.loading = true

    const content = await readFolder(node.options.path)

    const children: TAnything[] = []

    for (const element of content) {
        children.push({
            key: `${node.key}-${children.length}`,
            label: element.name,
            icon: element.preview && URL.canParse(element.preview) ? 'mdiFileImage' : element.preview,
            loading: false,
            leaf: element.kind === 'file',
            options: {
                path: element.path
            }
        })
    }

    node.children = children

    node.loading = false
}

watch(dataFolder, async (value) => {
    if (value && 'refresh' in value) {
        await handleClick_refresh()
        await refreshThree()
        modalStore.emptyModal("add_folder")
    }
})

watch(dataFile, async (value) => {
    if (value && 'refresh' in value) {
        await handleClick_refresh()
        await refreshThree()
        modalStore.emptyModal("add_file")
    }
})

onBeforeMount(async () => {
    await initSystem()
    await refreshThree()
    emits("changeDirectory", elementsShort.value)
    emits("changePath", history.value.current)
    emits("load", elementsShort.value)
})

onBeforeUnmount(() => {
    elements.value.clear()
    selectElement.value = null
})

defineExpose({
    refresh: async () => {
        await handleClick_refresh()
        await refreshThree()
    }
})
</script>

<template>
    <section style="display: grid;" class="gap-1"
        :style="{ gridTemplateColumns: props.showThree ? '200px 1fr' : '1fr' }">
        <section v-show="props.showThree">
            <ScrollPanel class="w-full h-[340px]">
                <Tree v-model:selectionKeys="selectElementThree" :value="optionsThree" selectionMode="single"
                    :metaKeySelection="true" class="p-0" loadingMode="icon"
                    @node-expand="handleNodeExpand_loadContentFolder">
                    <template #default="{ node }">
                        <section class="flex items-center justify-between w-full gap-2">
                            <section class="flex items-center">
                                <IconComponent :name="(node.icon as TAnything)" class="mr-1" />
                                <span class="max-w-[120px] truncate">
                                    {{ node.label }}
                                </span>
                            </section>
                        </section>
                    </template>
                </Tree>
            </ScrollPanel>
        </section>
        <section>
            <DataView :value="elementsShort" data-key="value" :layout="layout" class="view-file-project h-full">
                <template #header>
                    <section class="flex justify-between items-center">
                        <section class="flex gap-1">
                            <Button severity="secondary" size="small" class="px-1.5" @click="handleClick_home()"
                                :disabled="history.current === baseProject">
                                <IconComponent name="mdiHome" />
                            </Button>
                            <Button severity="secondary" size="small" class="px-1.5" @click="handleClick_back()"
                                :disabled="!history.previous.length">
                                <IconComponent name="mdiChevronLeft" />
                            </Button>
                            <Button severity="secondary" size="small" class="px-1.5" @click="handleClick_next()"
                                :disabled="!history.next.length">
                                <IconComponent name="mdiChevronRight" />
                            </Button>
                            <Button severity="secondary" size="small" class="px-1.5" @click="handleClick_top()"
                                :disabled="history.current === baseProject">
                                <IconComponent name="mdiArrowUp" />
                            </Button>
                            <Button severity="secondary" size="small" class="px-1.5" @click="handleClick_refresh()">
                                <IconComponent name="mdiRefresh" />
                            </Button>
                        </section>
                        <SelectButton v-model="layout" :options="options" :allowEmpty="false" option-value="value"
                            option-label="label">
                            <template #option="{ option }">
                                <IconComponent :name="option.icon" />
                            </template>
                        </SelectButton>
                    </section>
                </template>

                <template #empty>
                    <section class="flex justify-center items-center" :style="{ height: `${props.height}px` }"
                        @contextmenu="handleClick_contextMenuFileSystem($event)">
                        <h1 class="text-xl">
                            you don't have any sources
                        </h1>
                    </section>
                </template>

                <template #list="slotProps">
                    <ScrollPanel class="w-full" :style="{ height: `${props.height}px` }">
                        <div class="flex flex-col gap-2 py-2 box-border" @click.self="handleClick_select(null)"
                            @contextmenu.self="handleClick_contextMenuFileSystem($event)">
                            <section
                                class="p-2 rounded-md flex cursor-pointer items-center border-[1px] border-zinc-700 bg-zinc-900 transition-all ease-linear duration-300"
                                :class="{
                                    'bg-slate-800': selectElement?.index === element.index,
                                    'opacity-50': elementAction.element !== null && elementAction.element.name === element.name && elementAction.type === 'cut'
                                }" v-for="(element, index) in (slotProps.items as TFileElement[])" :key="index"
                                :title="element.name" @click="handleClick_select(element)"
                                @dblclick="handleClick_open(element)"
                                @contextmenu="handleClick_contextMenuElement($event, element)" draggable="true">
                                <section class="flex justify-center">
                                    <IconComponent
                                        :name="(urlCanParse(element.preview) ? 'mdiFileImage' : element.preview as TAnything)"
                                        size="18" class="mr-1" />
                                </section>
                                <section class="text-sm truncate select-none">
                                    {{ element.name }}
                                </section>
                            </section>
                        </div>
                    </ScrollPanel>
                </template>
                <template #grid="slotProps">
                    <ScrollPanel class="w-full" :style="{ height: `${props.height}px` }">
                        <div class="grid grid-cols-7 gap-2 py-2 box-border" @click.self="handleClick_select(null)"
                            @contextmenu.self="handleClick_contextMenuFileSystem($event)">
                            <section :title="element.name"
                                v-for="(element, index) in (slotProps.items as TFileElement[])" :key="index"
                                @click="handleClick_select(element)" @dblclick="handleClick_open(element)"
                                @contextmenu="handleClick_contextMenuElement($event, element)"
                                class="p-2 rounded-md flex flex-col cursor-pointer border-[1px] border-zinc-700 transition-all ease-linear duration-300 draggable"
                                :class="{
                                    'bg-slate-800': selectElement?.index === element.index,
                                    'bg-zinc-900': selectElement?.index !== element.index,
                                    'opacity-50': elementAction.element !== null && elementAction.element.name === element.name && elementAction.type === 'cut'
                                }" draggable="true" @dragstart="handleDragstart($event, element)"
                                @dragend="handleDragend($event)"
                                v-on:drop="element.kind === 'folder' ? handleDrop($event, element) : null"
                                v-on:dragover="element.kind === 'folder' ? $event.preventDefault() : null">
                                <section class="flex justify-center py-4">
                                    <IconComponent
                                        :name="urlCanParse(element.preview) ? 'mdiFileImage' : (element.preview as TAnything)"
                                        size="30" v-show="!urlCanParse(element.preview)" />
                                    <img :src="element.preview" class="w-full h-[40px] object-contain select-none"
                                        v-show="urlCanParse(element.preview)" draggable="false" />
                                </section>
                                <section class="text-sm truncate text-center select-none">
                                    {{ element.name }}
                                </section>
                            </section>
                        </div>
                    </ScrollPanel>
                </template>

                <template #footer>
                    <section class="flex justify-between items-center">
                        <section>
                            {{ elementsShort.length }} elements
                        </section>
                    </section>
                </template>
            </DataView>
        </section>
        <ContextMenuBasicComponent :options="optionsExplorer" @load="(value) => menuExplorerOptions = value" />
    </section>
</template>

<style>
.view-file-project .p-dataview-header {
    background-color: inherit;
    border: none;
    padding: 0;
    margin-bottom: 4px;
}

.view-file-project .p-dataview-footer {
    background-color: inherit;
    border: none;
    padding: 0;
    margin-top: 4px;
}

.view-file-project .p-dataview-content {
    background-color: inherit;
    border: none;
}

.view-file-project .p-dataview-empty-message {
    background-color: inherit;
    border: none;
}
</style>