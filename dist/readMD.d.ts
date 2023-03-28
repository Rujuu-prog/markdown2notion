interface FolderName {
    name: string;
}
interface MarkdownFileData {
    folderNames: FolderName[];
    fileName: string;
    blockContent: any;
}
export declare function readMD(dirPath: string): MarkdownFileData[];
export {};
