import type { TFileElement } from "@/types";
import { extname, resolve, join } from "@tauri-apps/api/path";
import { BaseDirectory, readDir, readFile, mkdir, copyFile } from "@tauri-apps/plugin-fs";

const customIconFolder: Record<string, string> = {
    ".project": "mdiFolderCog",
    ".scenes": "mdiFolderPlay",
    ".favorites": "mdiFolderStar",
    ".trash": "mdiTrashCan",
    ".packages": "mdiFolderWrench",
    ".git": "mdiGit",
    ".gitignore": "mdiGit",
    ".gitattributes": "mdiGit",
    ".gitmodules": "mdiGit",
    ".gitkeep": "mdiGit",
}

const customIconExt: Record<string, string> = {
    "scene": "mdiMovie",
    "object": "mdiCube",
    "mp3": "mdiFileMusic",
    "wav": "mdiFileMusic",
    "ogg": "mdiFileMusic",
    "mp4": "mdiFileVideo",
    "mov": "mdiFileVideo",
    "avi": "mdiFileVideo",
    "flv": "mdiFileVideo",
    "wmv": "mdiFileVideo",
    "mkv": "mdiFileVideo",
    "webm": "mdiFileVideo",
    "pdf": "mdiFilePdfBox",
    "PDF": "mdiFilePdfBox",
    "doc": "mdiFileWord",
    "docx": "mdiFileWord",
    "xls": "mdiFileExcel",
    "xlsx": "mdiFileExcel",
    "ppt": "mdiFilePowerpoint",
    "pptx": "mdiFilePowerpoint",
    "txt": "mdiFileDocument",
    "zip": "mdiZipBox",
    "rar": "mdiZipBox",
    "7z": "mdiZipBox",
    "tar": "mdiZipBox",
    "gz": "mdiZipBox",
    "html": "mdiLanguageHtml5",
    "css": "mdiLanguageCss3",
    "js": "mdiLanguageJavascript",
    "ts": "mdiLanguageTypescript",
    "json": "mdiCodeJson",
    "xml": "mdiCodeXml",
    "yaml": "mdiCodeYaml",
    "yml": "mdiCodeYaml",
    "md": "mdiLanguageMarkdown",
    "ttf": "mdiFormatFont",
    "otf": "mdiFormatFont",
    "woff": "mdiFormatFont",
    "woff2": "mdiFormatFont",
    "fbx": "mdiCubeScan",
    "obj": "mdiCubeScan",
    "gltf": "mdiCubeScan",
    "glb": "mdiCubeScan",
    "exe": "mdiApplication",
    "apk": "mdiApplication",
    "dmg": "mdiApplication",
    "iso": "mdiApplication",
    "bin": "mdiApplication",
    "deb": "mdiApplication",
    "rpm": "mdiApplication",
    "msi": "mdiApplication",
    "pkg": "mdiApplication",
    "appimage": "mdiApplication",
    "png": "mdiFileImage",
    "jpg": "mdiFileImage",
    "jpeg": "mdiFileImage",
    "webp": "mdiFileImage",
    "svg": "mdiFileImage",
};

const formats: Record<string, string[]> = {
    "image": ['png', 'jpg', 'jpeg', 'webp', 'svg'],
    "audio": ['mp3', 'wav', 'ogg'],
    "video": ['mp4', 'webm', 'ogg', 'mov', 'avi', 'flv', 'wmv', 'mkv'],
    "document": ['pdf', "PDF", 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    "archive": ['zip', 'rar', '7z', 'tar', 'gz'],
    "code": ['html', 'css', 'js', 'ts', 'json', 'xml', 'yaml', 'yml', 'md'],
    "font": ['ttf', 'otf', 'woff', 'woff2'],
    "3d": ['fbx', 'obj', 'gltf', 'glb'],
    "other": ['exe', 'apk', 'dmg', 'iso', 'bin', 'deb', 'rpm', 'msi', 'pkg', 'appimage', 'scene', 'object', 'resource']
}

export const typeFormat = (ext: string) => {
    for (const [key, value] of Object.entries(formats)) {
        if (value.includes(ext)) return key
    }

    return 'other'
}

export const validateFilter = (ext: string, filter: undefined | string[] | string) => {
    if (!filter) return true

    if (Array.isArray(filter)) {
        return filter.includes(ext)
    }

    const format = formats[filter]

    if (!format) return true

    return format.includes(ext)
}

export const createURLBase64 = async (path: string, ext: string) => {
    const source = await readFile(path, {
        baseDir: BaseDirectory.AppData,
    });

    const base64 = arrayBufferToBase64(source)

    const extension = ext === "svg" ? "svg+xml" : ext;

    return `data:image/${extension};base64,${base64}`
}

export const arrayBufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

export const readFolder = async (dirPath: string) => {
    const elements: TFileElement[] = [];

    const content = await readDir(dirPath, {
        baseDir: BaseDirectory.AppData
    })

    let index = 0;

    for (const { isDirectory, isFile, name } of content) {
        const path = await resolve(dirPath, name)

        const ext = isFile ? await extname(path) : undefined;

        const element: TFileElement = {
            kind: isDirectory ? 'folder' : 'file',
            name,
            ext,
            path,
            index,
            preview: isDirectory ? (customIconFolder[name] ?? 'mdiFolder') : 'mdiFile'
        }

        if (ext) {
            element.preview = customIconExt[ext] ?? 'mdiFile'

            element.format = typeFormat(ext) as TFileElement['format']
        }

        elements.push(element)

        index++;
    }

    return elements;
}

export const copyDirectory = async (sourceDir: string, targetDir: string) => {
    const entries = await readDir(sourceDir, { baseDir: BaseDirectory.AppData });

    await mkdir(targetDir, { baseDir: BaseDirectory.AppData, recursive: true });

    for (const entry of entries) {
        const sourcePath = await join(sourceDir, entry.name);
        const targetPath = await join(targetDir, entry.name);

        if (entry.isDirectory) {
            await copyDirectory(sourcePath, targetPath);
        } else {
            try {
                await copyFile(sourcePath, targetPath);
            } catch (error) {
                console.error(`Error al copiar el archivo de ${sourcePath} a ${targetPath}:`, error);
            }
        }
    }
}
