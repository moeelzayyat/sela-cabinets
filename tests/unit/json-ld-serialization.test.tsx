import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { ArticleSchema } from '@/components/seo/SchemaMarkup'


describe('JSON-LD serialization', () => {
  it('escapes markup-significant characters before inserting JSON into a script element', () => {
    const attack = '</script><script>globalThis.compromised=true</script>'
    const markup = renderToStaticMarkup(
      <ArticleSchema
        headline={attack}
        description="Safe description"
        canonicalPath="/blog/security-test"
        datePublished="2026-07-30"
        dateModified="2026-07-30"
      />
    )

    expect(markup).not.toContain(attack)
    expect(markup).not.toContain('</script><script>')
    expect(markup).toContain('\\u003c/script>\\u003cscript>')
  })
})
