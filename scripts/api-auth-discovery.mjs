import ts from 'typescript'

const HTTP_METHODS = new Set([
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
])

function isExported(node) {
  return Boolean(
    node.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    )
  )
}

export function discoverExportedMethods(fileName, sourceText) {
  const scriptKind = fileName.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS
  const source = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    scriptKind
  )

  if (source.parseDiagnostics.length) {
    const diagnostics = source.parseDiagnostics
      .map((diagnostic) => {
        const location =
          typeof diagnostic.start === 'number' ? ` at offset ${diagnostic.start}` : ''
        return `TS${diagnostic.code}${location}: ${ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          ' '
        )}`
      })
      .join('; ')
    throw new Error(`Route source parse failed for ${fileName}: ${diagnostics}`)
  }

  const methods = new Set()
  const unsupportedExports = []

  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      isExported(statement) &&
      statement.name &&
      HTTP_METHODS.has(statement.name.text)
    ) {
      methods.add(statement.name.text)
    }
    if (ts.isVariableStatement(statement) && isExported(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) {
          unsupportedExports.push(
            'destructured exported handlers are not supported in API route files'
          )
          continue
        }
        if (HTTP_METHODS.has(declaration.name.text)) {
          methods.add(declaration.name.text)
        }
      }
    }
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      for (const element of statement.exportClause.elements) {
        if (HTTP_METHODS.has(element.name.text)) methods.add(element.name.text)
      }
    }
    if (ts.isExportDeclaration(statement) && !statement.exportClause) {
      unsupportedExports.push(
        'export * declarations are not supported in API route files'
      )
    }
  }

  return { methods: [...methods].sort(), unsupportedExports }
}
