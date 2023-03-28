/**
 * Import Markdown files from the specified folder to a Notion database.
 *
 * @param token - The Notion API token.
 * @param databaseId - The ID of the Notion database to import Markdown files to.
 * @param mdFolderPath - The path of the folder containing the Markdown files.
 * @returns A promise that resolves when the import is complete.
 * @throws error If the token or database ID is missing.
 */
export declare function markdownToNotion(token: string | undefined, databaseId: string | undefined, mdFolderPath: string): Promise<void>;
