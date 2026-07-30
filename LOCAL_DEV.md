# Local Development

This folder is the local working copy for SELA Cabinets. It is separate from the live Coolify deployment.

## Current Local URL

```txt
http://localhost:3013
```

## Common Commands

```bash
corepack yarn install --frozen-lockfile
corepack yarn dev -p 3013
corepack yarn lint
corepack yarn build
```

## Safety Notes

- Work locally on the `local-improvements` branch.
- The live site is `https://selacabinets.com/`.
- Running the local dev server does not change production.
- Do not add real production credentials to `.env.local` unless they are explicitly needed for a local test, and never commit them.

