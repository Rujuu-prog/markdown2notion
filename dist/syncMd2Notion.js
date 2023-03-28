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
const client_1 = require("@notionhq/client");
const readMD_1 = require("./readMD");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;
async function main() {
    const notion = new client_1.Client({ auth: token });
    const mds = (0, readMD_1.readMD)('sample');
    if (databaseId) {
        const existingPages = await notion.databases.query({
            database_id: databaseId,
            sorts: [
                {
                    property: 'Title',
                    direction: 'ascending',
                },
            ],
        });
        // TODO: 上手く型定義できないのでanyにしている
        // DB上のタイトルを取得し配列に格納
        var existingPageTitles = {};
        existingPages.results.forEach((page) => {
            existingPageTitles[page.id] = page.properties.Title.title[0].text.content;
        });
        for (const md of mds) {
            // すでに存在するページの場合は削除処理(アーカイブへ)
            if (Object.values(existingPageTitles).includes(md.fileName)) {
                const pageId = Object.keys(existingPageTitles).find(key => existingPageTitles[key] === md.fileName);
                if (pageId) {
                    const resDelete = await notion.pages.update({
                        "page_id": pageId,
                        "archived": true,
                    });
                }
                else {
                    throw new Error('page_id is not found');
                }
            }
            const resCreate = await notion.pages.create({
                "parent": {
                    "type": "database_id", "database_id": databaseId
                },
                "properties": {
                    "Title": {
                        "title": [
                            {
                                "text": {
                                    "content": md.fileName
                                }
                            }
                        ]
                    },
                    "Tags": {
                        "multi_select": md.folderNames
                    },
                },
                "children": md.blockContent,
            });
        }
    }
}
main();
