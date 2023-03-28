/**
 * Import Markdown files from the specified folder to a Notion database.
 *
 * @param token - The Notion API token.
 * @param databaseId - The ID of the Notion database to import Markdown files to.
 * @param mdFolderPath - The path of the folder containing the Markdown files.
 * @param fileNameColumn - The name of the column in the Notion database to use for the file name.
 * @param tagsColumn - The name of the column in the Notion database to use for the tags.
 * @returns A boolean indicating whether the import was successful.
 * @throws error If the token or database ID is missing.
 */
export declare function markdownToNotion(token: string | undefined, databaseId: string | undefined, mdFolderPath: string, fileNameColumn?: string, tagsColumn?: string): Promise<boolean>;
