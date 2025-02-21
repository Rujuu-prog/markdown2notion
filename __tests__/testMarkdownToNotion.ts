import * as dotenv from 'dotenv'
import path from 'path'
import { markdownToNotion } from '../src'

dotenv.config()
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

const token = process.env.NOTION_TOKEN
console.log(token)
const databaseId = process.env.NOTION_DATABASE_ID
console.log(databaseId)
const docsPath = path.resolve(__dirname, '../sample/docs');
void markdownToNotion(token, databaseId, docsPath, 'Title', 'Tags')
