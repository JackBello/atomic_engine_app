<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { BaseDirectory, resolve } from '@tauri-apps/api/path';

import { useModalStore } from '@/stores/modal.store';
import IconComponent from '../icon.component.vue';
import { ConstructorNodes, type GlobalNode } from 'atomic-engine-lib';
import { listIconNode } from '@/domain/utils/icons';
import { useEngineStore } from '@/stores/engine.store';

const modalStore = useModalStore()
const { currentProject } = useEngineStore()

const modal = modalStore.getModal("make_script_node")
const dataFileExplorer = computed(() => modalStore.getModal("file_explorer").data)

const pathSave = ref("");
const language = ref({ name: "JavaScript", ext: "js", icon: "mdiLanguageJavascript" });
const inherits = ref("");
const className = ref("");
const fileName = ref("");
const builtInScript = ref(false);

const codeBasic = `
class %CLASS_NAME% extends %INHERITS% {
    _ready() {
        // Called when the node is added to the scene for the first time.

        Logger.info("Hello, world!");
    }

    _process(delta) {
        // Called every frame. Delta is the elapsed time since the previous frame.
    }
}
`

const languages = [
    {
        name: "JavaScript",
        ext: "js",
        icon: "mdiLanguageJavascript"
    },
    {
        name: "TypeScript",
        ext: "ts",
        icon: "mdiLanguageTypescript"
    },
]

const systemNodes = ref<string[]>([])

const handleClick_openExplorer = () => {
    modalStore.openModal("file_explorer", { path: pathSave.value })
}

const accept = async () => {
    if (!modal.data) return

    const node = modal.data.node as GlobalNode

    if (!node) return
    if (!fileName.value) return
    if (!className.value) return

    if (builtInScript.value) {
        node.$script.modeExecute = "none"

        node.$script.defineScript(codeBasic.replace("%CLASS_NAME%", className.value).replace("%INHERITS%", inherits.value))

        await node.$script.executeScript()
    } else {
        const path = await resolve(pathSave.value, `${fileName.value}.${language.value.ext}`);

        await writeTextFile(
            path,
            codeBasic.replace("%CLASS_NAME%", className.value).replace("%INHERITS%", inherits.value),
            { baseDir: BaseDirectory.AppData, createNew: true }
        );

        node.$script.modeExecute = "none"

        node.$script.defineScript(new URL(path))

        await node.$script.executeScript()
    }

    modalStore.closeModal("make_script_node")
}

const handleShow = async () => {
    const node = modal.data?.node as GlobalNode

    if (!node) return

    inherits.value = node.NODE_NAME
    fileName.value = node.slug
    className.value = "MyNode"
    pathSave.value = currentProject?.path ?? ""

    systemNodes.value = Object.keys(ConstructorNodes.getNodes()).filter((name) => name !== 'Scene')
}

const handleHide = () => {
    className.value = ""
    fileName.value = ""
    inherits.value = ""
    language.value = languages[0]
    builtInScript.value = false
    systemNodes.value = []
}

const cancel = () => {
    modalStore.closeModal("make_script_node")
}

watch(dataFileExplorer, (value) => {
    if (!value) return

    if (!value.save) return

    pathSave.value = value.save

    modalStore.emptyModal("file_explorer")
})
</script>

<template>
    <Dialog v-model:visible="modal.active" header="Make node script" :style="{ width: '25rem' }" modal
        :draggable="false" @hide="handleHide" @show="handleShow">
        <section class="flex flex-col gap-4 p-4">
            <section class="flex flex-col gap-1">
                <span class="text-surface-500 dark:text-surface-400 block">Language</span>
                <Select v-model="language" :options="languages" option-label="name" placeholder="Select a language">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                            <IconComponent :name="slotProps.value.icon" class="mr-2" />
                            <div>{{ slotProps.value.name }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <IconComponent :name="slotProps.option.icon" class="mr-2" />
                            <div>{{ slotProps.option.name }}</div>
                        </div>
                    </template>
                </Select>
            </section>

            <section class="flex flex-col gap-1">
                <span class="text-surface-500 dark:text-surface-400 block">Inherits</span>
                <Select v-model="inherits" :options="systemNodes" placeholder="Select a node">
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="flex items-center">
                            <img :src="listIconNode[slotProps.value]" width="26" class="mr-2" />
                            <div>{{ slotProps.value }}</div>
                        </div>
                        <span v-else>
                            {{ slotProps.placeholder }}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="flex items-center">
                            <img :src="listIconNode[slotProps.option]" width="26" class="mr-2" />
                            <div>{{ slotProps.option }}</div>
                        </div>
                    </template>
                </Select>
            </section>

            <section class="flex flex-col gap-1">
                <span class="text-surface-500 dark:text-surface-400 block">Class name</span>
                <InputText class="flex-auto" autocomplete="off" v-model="className" />
            </section>

            <section class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-400 block" for="fileName">File name</label>
                <InputGroup>
                    <InputText class="flex-auto" autocomplete="off" v-model="fileName" inputId="fileName" />
                    <InputGroupAddon>
                        <Button text @click="handleClick_openExplorer" severity="secondary">
                            <IconComponent name="mdiFolder" />
                        </Button>
                    </InputGroupAddon>
                </InputGroup>
                <span v-show="!builtInScript" class="text-surface-500 dark:text-surface-400 block"
                    for="fileName">Location</span>
                <Tag class="w-full" v-show="!builtInScript">
                    <template #default>
                        <section class="flex w-full items-center gap-2">
                            <IconComponent name="mdiFolder" />
                            <section>
                                <span class="text-surface-500 dark:text-surface-400 block"
                                    style="font-family: 'JetBrains Mono', monospace;">
                                    home://{{ pathSave.replace(currentProject?.path ?? "", "").slice(1) }}{{ fileName
                                    }}.{{ language.ext }}
                                </span>
                            </section>
                        </section>
                    </template>
                </Tag>
            </section>

            <section class="flex items-center gap-2">
                <label class="text-surface-500 dark:text-surface-400 block" for="builtInScript">Built in script</label>
                <Checkbox v-model="builtInScript" binary inputId="builtInScript" />
            </section>

            <section class="flex justify-between gap-2 mt-4">
                <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
                <Button type="button" label="Make" @click="accept"
                    :disabled="fileName === '' || className === ''"></Button>
            </section>
        </section>
    </Dialog>
</template>