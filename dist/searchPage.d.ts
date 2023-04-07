interface QueryResult {
    results: any[];
    next_cursor: string | null;
    has_more: boolean;
}
/**
 * Search a Notion database for a page with a specific title and tags.
 *
 * @param token - Notion API token.
 * @param databaseId - The ID of the database to search.
 * @param fileNameColumn - The column name for the file title (default: 'Title').
 * @param tagsColumn - The column name for the tags (default: 'Tags').
 * @param title - The title of the page to search for.
 * @param tags - An array of tags to filter the search results.
 * @returns A Promise resolving to the database query result.
 */
export declare function searchPage(token: string, databaseId: string, fileNameColumn: string | undefined, tagsColumn: string | undefined, title: string, tags: Array<string>): Promise<QueryResult>;
export {};
