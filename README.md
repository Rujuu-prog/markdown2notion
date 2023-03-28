# markdown2notion
[![npm version](https://badge.fury.io/js/markdown2notion.svg)](https://badge.fury.io/js/markdown2notion) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Convert markdown files to notion database. The folder structure is also fully represented as tags in notion.

> Please refer to [here](https://developers.notion.com/docs/getting-started) for how to issue notion token and how to link with DB.

## 🔗 Links
日本語の説明書👉[JP-README.md](https://github.com/Rujuu-prog/markdownToNotion/blob/main/README-JP.md)

## 🔽 Installation

```bash
npm install markdown2notion
```

```bash
yarn add markdown2notion
```

## 🔧 Usage

javascript and typescript are supported.

```typescript
import {markdownToNotion} from 'markdown2notion'

async function main(){
    try{
        await markdownToNotion(
        'notion token',
        'notion database id', 
        'markdown folder path', 
        'Column of notion displaying file names. Default is Title', 
        'Column of notion displaying folder name as tag. Default is Tags'
        )
    } catch (error) {
        console.error(error);
    }
}
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
[Sample Markdown Folder](https://github.com/Rujuu-prog/markdown2notion/tree/main/sample/docs)

### index.ts

```typescript
import {markdownToNotion} from 'markdown2notion'
import * as dotenv from 'dotenv'

async function main() {
    dotenv.config()
    const token = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID
    try {
      await markdownToNotion(token, databaseId, 'docs', 'Title', 'Tags');
    } catch (error) {
      console.error(error);
    }
}

main()
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

