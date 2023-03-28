"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markdownToNotion = void 0;
const client_1 = require("@notionhq/client");
const readMD_1 = require("./readMD");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// test用
// const token = process.env.NOTION_TOKEN
// const databaseId = process.env.NOTION_DATABASE_ID
// markdownToNotion(token, databaseId)
async function markdownToNotion(token, databaseId, mdFolderPath) {
    if (!token || !databaseId) {
        throw new Error('NOTION_TOKEN or NOTION_DATABASE_ID is missing');
    }
    const notion = new client_1.Client({ auth: token });
    const mds = (0, readMD_1.readMD)(mdFolderPath);
    try {
        const existingPages = await getExistingPages(notion, databaseId);
        for (const md of mds) {
            await processMarkdownFile(notion, existingPages, databaseId, md);
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
async function processMarkdownFile(notion, existingPageTitles, databaseId, md) {
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
        await createPage(notion, databaseId, md);
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
async function createPage(notion, databaseId, md) {
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
    });
}
