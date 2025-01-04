/// <reference types="vite/client" />

import type { TAnything } from "./types";

declare module "@jamescoyle/vue-icon" {
    import type { DefineComponent } from "vue";

    const component: DefineComponent<TAnything, TAnything, TAnything>;
    export default component;
}