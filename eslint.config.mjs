import nextVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // Preserve the Next 14 lint contract during this framework-only migration.
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['.next-playwright/**'],
  },
]

export default eslintConfig