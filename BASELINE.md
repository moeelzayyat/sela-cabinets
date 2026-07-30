# SELA Cabinets Baseline

This repository starts from the production Coolify handoff copy of `selacabinets.com`.

- Baseline date: 2026-07-23
- Public site: https://selacabinets.com/
- Production host: Coolify/Traefik, documented in `../handover.md`
- Local source base: `C:\Project\Selacabinets\server-copy`

Important working notes:

- Treat this repo as the new working base for changes going forward.
- Do not commit live credentials or copied production secrets.
- Production is currently Coolify-managed. Deploy changes through the approved Coolify/source workflow, not by editing files inside the running container.
- The handover notes warn that older upstream Coolify redeploys may overwrite manual production changes until this base is connected to the correct private Git source.

