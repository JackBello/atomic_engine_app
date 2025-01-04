import { BaseDirectory, appDataDir, resolve } from "@tauri-apps/api/path";
import { exists, mkdir } from "@tauri-apps/plugin-fs";
import type { LazyStore } from "@tauri-apps/plugin-store";

export const initStore = async (store: LazyStore) => {
    await store.init()

    const root = await store.has("root")
    const projects = await store.has("projects")

    if (!root) {
        await store.set("root", await resolve(await appDataDir(), "root"))
        await store.save()
    }

    if (!projects) {
        await store.set("projects", [])
        await store.save()
    }
}

export const initRoot = async () => {
    const hasRoot = await exists("root", { baseDir: BaseDirectory.AppData })

    if (!hasRoot) {
        await mkdir("root", { baseDir: BaseDirectory.AppData })
    }
}


export const initApp = async () => {
    const hasApp = await exists(await appDataDir(), { baseDir: BaseDirectory.AppData })

    if (!hasApp) {
        await mkdir(await appDataDir(), { baseDir: BaseDirectory.AppData })
    }
}