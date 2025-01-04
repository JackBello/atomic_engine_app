<script setup lang="ts">
import AddSourceModalComponent from '../modals/add-source-modal.component.vue';
import AddNodeModalComponent from '../modals/add-node-modal.component.vue';
import AddSceneModalComponent from '../modals/add-scene-modal.component.vue';
import AddFolderModalComponent from '../modals/add-folder-modal.component.vue';
import ScenesModalComponent from '../modals/scenes-modal.component.vue';
import AddFileModalComponent from '../modals/add-file-modal.component.vue';
import FilePreviewModalComponent from '../modals/file-preview-modal.component.vue';
import SaveInstanceNodeModalComponent from '../modals/save-instance-node-modal.component.vue';
import AddInstanceNodeModalComponent from '../modals/add-instance-node.component.vue';
import MakeScriptNodeModalComponent from '../modals/make-script-node-modal.component.vue';
import FileExplorerModalComponent from '../modals/file-explorer-modal.component.vue';
import AddScriptNodeModalComponent from '../modals/add-script-node-modal.component.vue';
</script>

<template>
    <MakeScriptNodeModalComponent />
    <AddScriptNodeModalComponent />
    <AddInstanceNodeModalComponent />
    <AddSourceModalComponent />
    <AddSceneModalComponent />
    <AddFolderModalComponent />
    <AddFileModalComponent />
    <AddNodeModalComponent />
    <SaveInstanceNodeModalComponent />
    <FilePreviewModalComponent />
    <FileExplorerModalComponent />
    <ScenesModalComponent />
</template>