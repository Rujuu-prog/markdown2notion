# markdown2notion
[![npm version](https://badge.fury.io/js/markdown2notion.svg)](https://badge.fury.io/js/markdown2notion) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

notionのDBにmarkdownファイルを変換するツールです。フォルダ構造もタグとして表現されます。

> notionのtokenの発行方法やDBとの紐付けかたは[こちら](https://developers.notion.com/docs/getting-started)を参照してください。

## 🔗 リンク
English👉[README.md](https://github.com/Rujuu-prog/markdownToNotion/blob/main/README.md)

## 🔽 インストール方法

```bash
npm install markdown2notion
```

```bash
yarn add markdown2notion
```

## 🔧 使い方

javascriptとtypescriptで使えます。

### markdownToNotion()

```typescript
import {markdownToNotion} from 'markdown2notion'



async function main(){
    try{
        await markdownToNotion(
        'notion_token', 
        'notion database id', 
        'markdownファイルが入っているフォルダのパス',
        'ファイル名を表示するnotionの列名。 デフォルトはTitle', 
        'タグとしてフォルダ名を表示する列名。 デフォルトはTags')
    } catch (error) {
        console.error(error);
    }
}
```

### searchPage()

> ページのURLはmarkdownToNotion()を使うたびに変更されるため、URLを使って何かしたい場合は、この関数でページのURLを取得してください。
  
  ```typescript
  import {searchPage} from 'markdown2notion'

  async function main(){
    try{
        const result = await searchPage(
        'notion token',
        'notion database id',
        'ファイル名を表示するnotionの列名。 デフォルトはTitle', 
        'タグとしてフォルダ名を表示する列名。 デフォルトはTags'
        '検索したいファイル名',
        '検索したいファイルが入っているフォルダ名。配列で指定。'
        )
        // 同じファイル名のファイルが存在している場合、複数のページが返ってきます。
        console.log(result)// notionのpageのobjectが返ってきます。urlはresult['results'][0]['url']とかで取れます。
    } catch (error) {
        console.error(error)
    }
  }
  ```


## 🔰 使用例

### 🔽markdownToNotion()

### フォルダ構成

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

### マークダウンファイルのサンプル
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

### index.tsの実行結果
フォルダ構造がタグとして表現されます。
![](https://user-images.githubusercontent.com/81368541/228250770-6c9912c6-bc2f-401c-967a-76e7ae15117a.png)

タグでフィルタリングすることで、見たいファイルをすぐに探すことができます。
![](https://user-images.githubusercontent.com/81368541/228253068-aa17bc25-5401-43c1-8ecc-d98f6a5c1ab9.png)

### 🔽searchPage()

### index.ts

```typescript
import {searchPage} from 'markdown2notion'
import * as dotenv from 'dotenv'

async function main() {
    dotenv.config()
    const token = process.env.NOTION_TOKEN
    const databaseId = process.env.NOTION_DATABASE_ID
    const title = 'sampleContent1_1';
    const tags = ['sample1_1'];

    try {
      const result = await searchPage(token, databaseId, 'Title', 'Tags', title, tags);
      console.log(result['results'][0]['url']);
    } catch (error) {
      console.error('Error searching for page:', error);
    }
}

main()
```

### result

```bash
{
  object: 'list',
  results: [
    {
      object: 'page',
      id: '33.....',
      created_time: '2023-03-29T14:15:00.000Z',
      last_edited_time: '2023-03-29T14:15:00.000Z',
      created_by: [Object],
      last_edited_by: [Object],
      cover: null,
      icon: null,
      parent: [Object],
      archived: false,
      properties: [Object],
      url: 'https://www.notion.so/sampleContent1_1-33...'
    }
  ],
  next_cursor: null,
  has_more: false,
  type: 'page',
  page: {}
}
```


<h2 style="color:red;">👀 注意点</h2>
操作対象のnotionのDB上に、ファイル名と同じページがある場合は上書きされます。

## ライセンス

MIT
