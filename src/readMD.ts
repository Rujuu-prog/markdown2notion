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

function removeMarkdownLinks(content: string): string {
    // ページ内リンクの正規表現
    const linkPattern = /\[([^\]]+)]\(#([^\)]+)\)/g
    return content.replace(linkPattern, '$1')
  }

/**
 * Read and process Markdown files from a specified directory.
 * The function reads all Markdown files in the directory and its subdirectories, extracts their content, and converts it to Notion block format.
 *
 * @param dirPath - The path to the directory containing the Markdown files.
 * @returns An array of MarkdownFileData objects containing folder names, file names, and Notion block content.
 */
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
        const noLinkContent = removeMarkdownLinks(content)
        const blockContent = markdownToBlocks(noLinkContent)
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
