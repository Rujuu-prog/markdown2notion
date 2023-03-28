import { Client } from '@notionhq/client'
import { readMD } from './readMD'
import * as dotenv from 'dotenv'
dotenv.config()

type PageTitle = Record<string, string>

// test用
// const token = process.env.NOTION_TOKEN
// const databaseId = process.env.NOTION_DATABASE_ID
// markdownToNotion(token, databaseId, 'sample/docs', 'Title', 'Tags')

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
export async function markdownToNotion (token:string|undefined, databaseId:string|undefined,
  mdFolderPath:string,
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags'): Promise<boolean> {
  if (!token || !databaseId) {
    throw new Error('NOTION_TOKEN or NOTION_DATABASE_ID is missing')
  }

  const notion = new Client({ auth: token })
  const mds = readMD(mdFolderPath)

  try {
    const existingPages = await getExistingPages(notion, databaseId)
    for (const md of mds) {
      await processMarkdownFile(notion, existingPages, databaseId, md, fileNameColumn, tagsColumn)
    }
    return true
  } catch (error) {
    handleError(error)
    return false
  }
}

function handleError (error: unknown): void {
  if (error instanceof Error) {
    console.error('An error occurred:', error.message)
  } else {
    console.error('An unknown error occurred:', error)
  }
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
  // TODO: 上手く型定義できないのでanyにしている
  // DB上のタイトルを取得し配列に格納
  const existingPageTitles: PageTitle = {}
  existingPages.results.forEach((page: any) => {
    existingPageTitles[page.id] = page.properties.Title.title[0].text.content
  })

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
      if (pageId) {
        await archivePage(notion, pageId)
      } else {
        throw new Error('page_id is not found')
      }
    }
    await createPage(notion, databaseId, md, fileNameColumn, tagsColumn)
  } catch (error) {
    handleError(error)
  }
}

async function archivePage (notion: Client, pageId: string): Promise<void> {
  const resDelete = await notion.pages.update({
    page_id: pageId,
    archived: true
  })
}

async function createPage (
  notion: Client,
  databaseId: string,
  md: ReturnType<typeof readMD>[number],
  fileNameColumn: string = 'Title',
  tagsColumn: string = 'Tags'
): Promise<void> {
  const resCreate = await notion.pages.create({
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
