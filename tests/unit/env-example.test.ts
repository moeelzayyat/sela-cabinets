import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const sourceExtensions = new Set(['.js', '.mjs', '.ts', '.tsx'])

function sourceFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(entryPath)
    return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : []
  })
}

describe('environment example', () => {
  it('documents every source-used environment key with blank values', () => {
    const sourceKeys = new Set<string>()
    for (const fileName of sourceFiles('src')) {
      const source = fs.readFileSync(fileName, 'utf8')
      for (const match of Array.from(
        source.matchAll(/process\.env\.([A-Z][A-Z0-9_]*)/g)
      )) {
        sourceKeys.add(match[1])
      }
    }

    const example = fs.readFileSync('env.example.txt', 'utf8')
    const assignments = Array.from(
      example.matchAll(/^([A-Z][A-Z0-9_]*)=(.*)$/gm),
      ([, key, value]) => ({ key, value })
    )
    const documentedKeys = new Set(assignments.map(({ key }) => key))
    const missingKeys = Array.from(sourceKeys)
      .filter((key) => !documentedKeys.has(key))
      .sort()
    const populatedKeys = assignments
      .filter(({ value }) => value.trim())
      .map(({ key }) => key)
      .sort()

    expect(missingKeys).toEqual([])
    expect(populatedKeys).toEqual([])
  })
})
