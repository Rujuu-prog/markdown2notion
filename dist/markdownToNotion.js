"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToNotion = void 0;
const client_1 = require("@notionhq/client");
const readMD_1 = require("./readMD");
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
async function markdownToNotion(token, databaseId, mdFolderPath, fileNameColumn = 'Title', tagsColumn = 'Tags') {
    if (!token || !databaseId) {
        throw new Error('NOTION_TOKEN or NOTION_DATABASE_ID is missing');
    }
    const notion = new client_1.Client({ auth: token });
    const mds = (0, readMD_1.readMD)(mdFolderPath);
    try {
        const existingPages = await getExistingPages(notion, databaseId);
        for (const md of mds) {
            await processMarkdownFile(notion, existingPages, databaseId, md, fileNameColumn, tagsColumn);
        }
    }
    catch (error) {
        handleError(error);
    }
}
exports.markdownToNotion = markdownToNotion;
function handleError(error) {
    if (error instanceof Error) {
        console.error('An error occurred:', error.message);
    }
    else {
        console.error('An unknown error occurred:', error);
    }
}
async function getExistingPages(notion, databaseId) {
    const existingPages = await notion.databases.query({
        database_id: databaseId,
        sorts: [
            {
                property: 'Title',
                direction: 'ascending'
            }
        ]
    });
    // TODO: 上手く型定義できないのでanyにしている
    // DB上のタイトルを取得し配列に格納
    const existingPageTitles = {};
    existingPages.results.forEach((page) => {
        existingPageTitles[page.id] = page.properties.Title.title[0].text.content;
    });
    return existingPageTitles;
}
async function processMarkdownFile(notion, existingPageTitles, databaseId, md, fileNameColumn = 'Title', tagsColumn = 'Tags') {
    try {
        // すでに存在するページの場合は削除処理(アーカイブへ)
        if (Object.values(existingPageTitles).includes(md.fileName)) {
            const pageId = Object.keys(existingPageTitles).find((key) => existingPageTitles[key] === md.fileName);
            if (pageId) {
                await archivePage(notion, pageId);
            }
            else {
                throw new Error('page_id is not found');
            }
        }
        await createPage(notion, databaseId, md, fileNameColumn, tagsColumn);
    }
    catch (error) {
        handleError(error);
    }
}
async function archivePage(notion, pageId) {
    const resDelete = await notion.pages.update({
        page_id: pageId,
        archived: true
    });
}
async function createPage(notion, databaseId, md, fileNameColumn = 'Title', tagsColumn = 'Tags') {
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
    });
}
//# sourceMappingURL=markdownToNotion.js.map