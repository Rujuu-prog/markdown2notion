import { Client } from '@notionhq/client'

// Define a custom type for the database query result
interface QueryResult {
  results: any[]
  next_cursor: string | null
  has_more: boolean
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
export async function searchPage (
  token: string,
  databaseId: string,
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags',
  title: string,
  tags: string[]
): Promise<QueryResult> {
  const notion = new Client({ auth: token })

  // Create the tag filters from the input tags array
  const tagFilters = tags.map(tag => ({
    property: tagsColumn,
    multi_select: {
      contains: tag
    }
  }))

  // Perform the database query with the specified filters
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: fileNameColumn,
            rich_text: {
              equals: title
            }
          },
          ...tagFilters
        ]
      }
    })

    return response
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error('Error querying the Notion database:', error)
    throw error
  }
}
