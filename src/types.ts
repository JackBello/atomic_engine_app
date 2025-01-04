import type * as icons from '@mdi/js';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type TAnything = any

export type TIcon = (keyof typeof icons)

export interface IProject {
    id: string
    name: string
    image?: string
    description?: string
    path: string
    favorite: boolean
    trash: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
    opened_at: string | null
    tags: string[]
    info: {
        type: string
        context: string
        mode: string
    }
}

export type TFileElement = {
    kind: "folder" | "file"
    name: string
    ext?: string
    path: string
    index: number
    loading?: boolean
    preview: string
    format?: "image" | "video" | "audio" | "code" | "document" | "archive" | "font" | "3d" | "other"
}
