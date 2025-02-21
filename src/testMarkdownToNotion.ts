import * as dotenv from 'dotenv'
import path from 'path'
import { markdownToNotion } from './markdownToNotion'

dotenv.config()
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

const token = process.env.NOTION_TOKEN
console.log(token)
const databaseId = process.env.NOTION_DATABASE_ID
console.log(databaseId)
void markdownToNotion(token, databaseId, '../sample/docs', 'Title', 'Tags')
