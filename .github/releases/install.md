<!-- SPDX-License-Identifier: AGPL-3.0-only | Copyright (c) 2026 zpt0 | Copyright (c) 2026 Anasdh -->

### Install

1. Unzip the archive into `<Vencord>/src/userplugins/`; the folder has to be named `vencord-quests`
2. Rebuild Vencord, then press `Ctrl+R` in Discord
3. Enable **VenQuests** under `Settings → Vencord → Plugins`

Updating? Replace the `vencord-quests` folder, rebuild and reload — your settings are kept.

Checking the download (optional): `sha256sum -c SHA256SUMS` verifies the archive, and `gh attestation verify vencord-quests-vX.Y.Z.zip -R Anaaasdh/vencord-quests` verifies that this repository's release workflow built it.
