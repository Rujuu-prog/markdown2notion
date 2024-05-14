import { readMD } from '../src/readMD'

describe('readMD', () => {
  let result: ReturnType<typeof readMD>
  const dirPath = 'sample/docs'

  // 各テストケースの実行前に共通の読み込み処理を行う
  beforeEach(() => {
    result = readMD(dirPath)
  })

  it('should correctly process folder and file structure from sample/docs', () => {
    // 想定される結果
    const expected = [
      {
        folderNames: [{ name: 'sample1' }, { name: 'sample1_1' }],
        fileName: 'sampleContent1_1',
        blockContent: expect.any(Array)
      },
      {
        folderNames: [{ name: 'sample1' }],
        fileName: 'sampleContent1',
        blockContent: expect.any(Array)
      },
      {
        folderNames: [{ name: 'sample2' }],
        fileName: 'sampleContent2',
        blockContent: expect.any(Array)
      }
    ]
    expect(result).toEqual(expected)
  })

  it('should contain specific blocks in blockContent from sampleContent1', () => {
    // `sampleContent1` のデータを抽出
    const sampleContent1 = result.find(file => file.fileName === 'sampleContent1')

    if (sampleContent1 === undefined) {
      throw new Error('sampleContent1 not found')
    }
    // 部分一致で検証する内容
    const partialExpectedBlocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'sample1', link: undefined }
            })
          ])
        }
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'falkjfdlgdal', link: undefined }
            })
          ])
        }
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'klaj;jfa', link: undefined }
            })
          ])
        }
      }
    ]

    expect(sampleContent1.blockContent).toEqual(expect.arrayContaining(partialExpectedBlocks))
  })

  it('should contain specific blocks in blockContent from sampleContent1_1', () => {
    // `sampleContent1_1` のデータを抽出
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const sampleContent1_1 = result.find(file => file.fileName === 'sampleContent1_1')

    if (sampleContent1_1 === undefined) {
      throw new Error('sampleContent1_1 not found')
    }
    // 部分一致で検証する内容
    const partialExpectedBlocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'sample3', link: undefined }
            })
          ])
        }
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'dafjkafda', link: undefined }
            })
          ])
        }
      }
    ]
    // `sampleContent1_1` の blockContent に特定のブロックが含まれていることを検証
    expect(sampleContent1_1.blockContent).toEqual(expect.arrayContaining(partialExpectedBlocks))
  })

  it('should contain specific blocks in blockContent from sampleContent2', () => {
    // `sampleContent2` のデータを抽出
    const sampleContent2 = result.find(file => file.fileName === 'sampleContent2')

    if (sampleContent2 === undefined) {
      throw new Error('sampleContent2 not found')
    }
    // 部分一致で検証する内容
    const partialExpectedBlocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'sample2', link: undefined }
            })
          ])
        }
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: expect.arrayContaining([
            expect.objectContaining({
              type: 'text',
              text: { content: 'Table of Contents', link: undefined }
            })
          ]),
          children: expect.arrayContaining([
            expect.objectContaining({
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'text',
                    text: { content: 'Introduction', link: undefined }
                  })
                ])
              }
            })
          ])
        }
      }
    ]
    // `sampleContent2` の blockContent に特定のブロックが含まれていることを検証
    expect(sampleContent2.blockContent).toEqual(expect.arrayContaining(partialExpectedBlocks))
  })
})
