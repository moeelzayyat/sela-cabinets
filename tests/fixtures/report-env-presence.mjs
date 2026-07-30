const result = {
  arbitrarySecretPresent: Boolean(process.env.AWS_SECRET_ACCESS_KEY),
  inheritedAdminSecretPresent:
    process.env.ADMIN_SECRET === 'parent-admin-secret-sentinel',
  syntheticAdminSecretPresent:
    process.env.ADMIN_SECRET ===
    'test-only-admin-signing-secret-000000000000',
  testDistDir: process.env.SELA_TEST_DIST_DIR,
}

process.stdout.write(JSON.stringify(result))
