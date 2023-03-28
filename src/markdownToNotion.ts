import { Client } from '@notionhq/client'
import { readMD } from './readMD'
import * as dotenv from 'dotenv'
dotenv.config()

type PageTitle = Record<string, string>

// testように環境変数から取得
// const token = process.env.NOTION_TOKEN
// const databaseId = process.env.NOTION_DATABASE_ID

export async function markdownToNotion (token:string, databaseId:string, mdFolderPath:string): Promise<void> {
  if (!token || !databaseId) {
    throw new Error('NOTION_TOKEN or NOTION_DATABASE_ID is missing')
  }

  const notion = new Client({ auth: token })
  const mds = readMD(mdFolderPath)

  try {
    const existingPages = await getExistingPages(notion, databaseId)
    for (const md of mds) {
      await processMarkdownFile(notion, existingPages, databaseId, md)
    }
  } catch (error) {
    handleError(error)
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
  md: ReturnType<typeof readMD>[number]
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
    await createPage(notion, databaseId, md)
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
  md: ReturnType<typeof readMD>[number]
): Promise<void> {
  const resCreate = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: databaseId
    },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: md.fileName
            }
          }
        ]
      },
      Tags: {
        multi_select: md.folderNames
      }
    },
    children: md.blockContent
  })
}
