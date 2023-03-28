interface FolderName {
    name: string;
}
interface MarkdownFileData {
    folderNames: FolderName[];
    fileName: string;
    blockContent: any;
}
/**
 * Read and process Markdown files from a specified directory.
 * The function reads all Markdown files in the directory and its subdirectories, extracts their content, and converts it to Notion block format.
 *
 * @param dirPath - The path to the directory containing the Markdown files.
 * @returns An array of MarkdownFileData objects containing folder names, file names, and Notion block content.
 */
export declare function readMD(dirPath: string): MarkdownFileData[];
export {};
