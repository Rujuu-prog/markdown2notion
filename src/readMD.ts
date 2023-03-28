import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'
import { markdownToBlocks } from '@tryfabric/martian'

interface FolderName {
  name: string
}

interface MarkdownFileData {
  folderNames: FolderName[]
  fileName: string
  blockContent: any
}

export function readMD (dirPath: string): MarkdownFileData[] {
  const result: MarkdownFileData[] = []

  function walk (currentPath: string): void {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name)

      if (entry.isDirectory()) {
        walk(entryPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        const content = matter(fs.readFileSync(entryPath, 'utf-8')).content
        const blockContent = markdownToBlocks(content)
        const relativePath = path.relative(dirPath, entryPath)
        const pathParts = relativePath.split(path.sep)

        const fileNameWithExtension = pathParts.pop() as string
        const fileNameWithoutExtension = path.basename(fileNameWithExtension, '.md')
        const folderNames = pathParts.map(folderName => ({ name: folderName }))

        result.push({ folderNames, fileName: fileNameWithoutExtension, blockContent })
      }
    }
  }

  walk(dirPath)
  return result
}

// const markdownFiles = readMD('sample');
// console.dir(markdownFiles);
// console.log('%o', markdownFiles);
