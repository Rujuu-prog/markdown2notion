import { Client, isFullPage } from '@notionhq/client'
import { readMD } from './readMD'
import chalk from 'chalk'

type PageTitle = Record<string, string>

// test用
// import * as dotenv from 'dotenv'
// dotenv.config()
// const token = process.env.NOTION_TOKEN
// const databaseId = process.env.NOTION_DATABASE_ID
// markdownToNotion(token, databaseId, 'sample/docs', 'Title', 'Tags')

// TODO: 返り値がてきとうなので整理する

/**
 * Import Markdown files from the specified folder to a Notion database.
 *
 * @param token - The Notion API token.
 * @param databaseId - The ID of the Notion database to import Markdown files to.
 * @param mdFolderPath - The path of the folder containing the Markdown files.
 * @param fileNameColumn - The name of the column in the Notion database to use for the file name.
 * @param tagsColumn - The name of the column in the Notion database to use for the tags.
 * @returns Returns error if an error occurs.
 * @throws error If the token or database ID is missing.
 */
export async function markdownToNotion (token: string | undefined, databaseId: string | undefined,
  mdFolderPath: string,
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags'): Promise<void> {
  if (token === undefined || databaseId === undefined) {
    throw new Error('NOTION_TOKEN or NOTION_DATABASE_ID is missing')
  }

  const notion = new Client({ auth: token })
  const mds = readMD(mdFolderPath)

  try {
    const existingPages = await getExistingPages(notion, databaseId)
    for (const md of mds) {
      await processMarkdownFile(notion, existingPages, databaseId, md, fileNameColumn, tagsColumn)
    }
  } catch (error) {
    handleError(error)
  }
}

/**
 * Handles the error and outputs an appropriate message to the console.
 *
 * @param error - The error to handle.
 */
function handleError (error: unknown): void {
  if (error instanceof Error) {
    console.error(`${chalk.red('Error: ')} ${error.message}`)
  } else {
    console.error(`${chalk.red('Error: ')} An unknown error occurred:`, error)
  }
}

/**
 * Determines if the property has a title property.
 *
 * @param property - The property to check.
 * @returns True if the property has a title property, otherwise false.
 */
function hasTitleProperty (property: any): property is { title: Array<{ text: { content: string } }> } {
  return property.type === 'title' && Array.isArray(property.title)
}

async function getExistingPages (
  notion: Client,
  databaseId: string
): Promise<PageTitle> {
  const existingPages = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: 'Title',
        direction: 'ascending'
      }
    ]
  })
  // DB上のタイトルを取得し配列に格納
  const existingPageTitles: PageTitle = {}
  for (const page of existingPages.results) {
    if (isFullPage(page)) {
      const titleProperty = page.properties.Title
      if (hasTitleProperty(titleProperty)) {
        if (titleProperty.title.length >= 1) {
          // タイトルが存在する場合はIDとタイトルを格納
          existingPageTitles[page.id] = titleProperty.title[0].text.content
        } else {
          // タイトルが存在しない場合は警告を出力し、アーカイブ処理を行う
          const warningMessage = `Page with ID ${page.id} has an empty title. Archiving the page.`
          console.warn(`${chalk.yellow('warning: ')} ${warningMessage}`)
          try {
            await archivePage(notion, page.id)
          } catch (error) {
            handleError(error)
          }
        }
      }
    }
  }
  return existingPageTitles
}

async function processMarkdownFile (
  notion: Client,
  existingPageTitles: PageTitle,
  databaseId: string,
  md: ReturnType<typeof readMD>[number],
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags'
): Promise<void> {
  try {
    // すでに存在するページの場合は削除処理(アーカイブへ)
    if (Object.values(existingPageTitles).includes(md.fileName)) {
      const pageId = Object.keys(existingPageTitles).find(
        (key) => existingPageTitles[key] === md.fileName
      )
      if (pageId !== undefined) {
        await archivePage(notion, pageId)
      } else {
        handleError(new Error('page_id is not found'))
      }
    }
    await createPage(notion, databaseId, md, fileNameColumn, tagsColumn)
  } catch (error) {
    handleError(error)
  }
}

async function archivePage (notion: Client, pageId: string): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    archived: true
  })
}

export async function createPage (
  notion: Client,
  databaseId: string,
  md: ReturnType<typeof readMD>[number],
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags'
): Promise<void> {
  await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: databaseId
    },
    properties: {
      [fileNameColumn]: {
        title: [
          {
            text: {
              content: md.fileName
            }
          }
        ]
      },
      [tagsColumn]: {
        multi_select: md.folderNames
      }
    },
    children: md.blockContent
  })
}
