<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import typesEngine from '@/domain/utils/types.engine'
import { BaseDirectory, open, readTextFile } from '@tauri-apps/plugin-fs';
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/stores/scene.store';

const sceneStore = useSceneStore()
const { scriptNode } = storeToRefs(sceneStore)

const editorContainer = ref<null | HTMLElement>(null);

let editor: null | monaco.editor.IStandaloneCodeEditor = null

const loadCode = async () => {
    let result = '// Escribe tu código aquí'

    if (!scriptNode.value) return result

    if (scriptNode.value.$script.source && scriptNode.value.$script.source instanceof URL) {
        result = await readTextFile(scriptNode.value.$script.source, {
            baseDir: BaseDirectory.AppData
        })
    } else if (scriptNode.value.$script.source && typeof scriptNode.value.$script.source === 'string') {
        result = scriptNode.value.$script.source
    }

    return result
}

const initEditor = async () => {
    if (!editorContainer.value) return

    const code = await loadCode()

    editor = monaco.editor.create(editorContainer.value, {
        value: code,
        language: 'javascript',
        theme: 'vs-dark',
        automaticLayout: true,
        fontFamily: "'JetBrains Mono', monospace",
        fontLigatures: true
    })
}

const handleClick_save = async () => {
    if (!editor) return

    if (!scriptNode.value) return

    const code = editor.getValue()

    if (scriptNode.value.$script.source && scriptNode.value.$script.source instanceof URL) {
        const file = await open(scriptNode.value.$script.source, {
            write: true,
            truncate: true,
            baseDir: BaseDirectory.AppData,
        });

        await file.write(new TextEncoder().encode(code));
        await file.close();

        scriptNode.value.$script.modeExecute = "none"

        await scriptNode.value.$script.executeScript()
    } else {
        scriptNode.value.$script.modeExecute = "none"

        scriptNode.value.$script.defineScript(code)

        await scriptNode.value.$script.executeScript()
    }
}

onMounted(async () => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(typesEngine, 'global.d.ts');
    monaco.languages.typescript.javascriptDefaults.addExtraLib(typesEngine, 'global.d.ts');

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        jsx: monaco.languages.typescript.JsxEmit.None,
    });

    await initEditor()
})

onBeforeMount(() => {
    window.MonacoEnvironment = {
        getWorker(_, label) {
            switch (label) {
                case 'javascript': return new JsWorker()
                default: return new EditorWorker()
            }
        }
    }
})

onUnmounted(() => {
    if (editor) {
        editor.dispose()
    }

    window.MonacoEnvironment = undefined
    editorContainer.value = null
    scriptNode.value = null
})
</script>

<template>
    <section class="grid w-full h-full flex-auto z-50 bg-zinc-900" style="grid-template-rows: 30px 1fr 0.1fr;">
        <section class="w-full">

        </section>
        <section class="w-full flex">
            <section class="w-60 flex-initial flex-col">

            </section>
            <section class="flex-auto">
                <div ref="editorContainer" style="height: 800px;"></div>
            </section>
        </section>
        <section class="px-2">
            <Button @click="handleClick_save()">
                Save
            </Button>
        </section>
    </section>
</template>