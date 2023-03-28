# markdown-to-notion
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert markdown files to notion database. The folder structure is also fully represented as tags in notion.



## 🔗 Links
日本語の説明書👉[JP-README.md](https://github.com/Rujuu-prog/markdownToNotion/blob/main/README-JP.md)



## 🔽 Installation

```bash
npm install markdown-to-notion
```

```bash
yarn add markdown-to-notion
```

## 🔧 Usage

javascript and typescript are supported.

```typescript
import {markdownToNotion} from 'markdown-to-notion'

// Returns true on success, false on failure
const result = markdownToNotion(
'notion token',
'notion database id', 
'markdown folder path', 
'Column of notion displaying file names. Default is Title', 
'Column of notion displaying folder name as tag. Default is Tags'
)
```


## 🔰 Example

### markdown folder structure

```bash
├── docs
│   ├── sample1
│   │   ├── sample1_1
│   │   │   ├── sampleContent1_1.md
│   │   ├── sampleContent1.md
│   ├── sample2
│   │   ├── sampleContent2.md
├── src
│   ├── index.ts
├── .env
```

### notion DB

![](https://user-images.githubusercontent.com/81368541/228247308-30b798e0-b029-4d21-9a91-9d045f11997f.png)

### markdown files
[Sample Markdown Folder](https://github.com/Rujuu-prog/markdownToNotion/tree/main/sample/doc)

### index.ts

```typescript
import {markdownToNotion} from 'markdown-to-notion'
import * as dotenv from 'dotenv'
dotenv.config()

const token = process.env.NOTION_TOKEN
const databaseId = process.env.NOTION_DATABASE_ID

const result = markdownToNotion(token, databaseId, '../docs', 'Title', 'Tags')
```

### .env

```.env
NOTION_TOKEN=secret_xxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxx
```

### Result
The folder name becomes a tag.
![](https://user-images.githubusercontent.com/81368541/228250770-6c9912c6-bc2f-401c-967a-76e7ae15117a.png)

Filtering using tags makes it easier to access specific files.
![](https://user-images.githubusercontent.com/81368541/228253068-aa17bc25-5401-43c1-8ecc-d98f6a5c1ab9.png)

<h2 style="color:red;">👀 Important Point</h2>
If there is a page with the same filename on the DB of notion to be operated on, it will be overwritten.

## License

MIT

