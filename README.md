<p align="center">
  <img src=".assets/banner-top.svg" width="100%" alt="VenQuests"/>
</p>

<p align="center">
  <strong>Finish your Discord Quests without babysitting them.</strong><br/>
  A <a href="https://github.com/Vendicated/Vencord">Vencord</a> plugin that queues, runs and tracks quests in the background, one at a time.
</p>

<p align="center">
  <a href="https://github.com/Anaaasdh/vencord-quests/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Anaaasdh/vencord-quests/ci.yml?branch=main&style=for-the-badge&logo=github&label=CI" alt="CI"/></a>
  <a href="https://github.com/Anaaasdh/vencord-quests/releases"><img src="https://img.shields.io/github/v/release/Anaaasdh/vencord-quests?style=for-the-badge&label=release" alt="Release"/></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-blue?style=for-the-badge" alt="License"/></a>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

<p align="center">
  <a href="#-features">Features</a> ·
  <a href="#-installation">Installation</a> ·
  <a href="#-settings">Settings</a> ·
  <a href="#-supported-quests">Supported quests</a> ·
  <a href="#-troubleshooting">Troubleshooting</a> ·
  <a href="#-development">Development</a>
</p>

> [!WARNING]
> Automating quests may violate Discord's [Terms of Service](https://discord.com/terms) and can get an account restricted or terminated. This project is provided for educational purposes, use it at your own risk.

---

## ✨ Features

| | |
|---|---|
| 🤖 **Auto-complete all** | One switch and every available quest is accepted, queued and finished on its own. Quests run **one at a time with a 3 minute pause** in between, so nothing overlaps. Off by default. |
| 📋 **Smart queue** | Add quests from the tile button or right-click menu. Videos and games alternate, or pick which kind goes first. The queue survives reloads. |
| 🔔 **New quest alerts** | Get an in-app pill and, if you allow it, a desktop notification the moment a new quest appears. First launch only records what exists, so you never get a flood. |
| 📊 **Live progress** | A compact pill shows the running quest with a progress bar and a cancel button. Position, colors, radius, opacity and size are all configurable. |
| 🛡️ **Safe by design** | Rate-limit aware retries, a stall watchdog, per-account state and clean teardown when you cancel or switch accounts. |
| 🌍 **Localized UI** | English, Deutsch, Français, Español, Italiano, Português, Русский, 日本語, 한국어, 中文. |

## 📦 Installation

VenQuests is a userplugin, so Vencord has to be built from source.

```bash
cd path/to/Vencord/src/userplugins
git clone https://github.com/Anaaasdh/vencord-quests.git

cd ../..            # back to the Vencord root
pnpm build          # or: pnpm buildWeb for the browser build
```

Restart Discord (`Ctrl+R`) and enable **VenQuests** under `Settings → Vencord → Plugins`.

Need help building Vencord? Follow the [official guide](https://docs.vencord.dev/installing/custom-plugins/).

## 🚀 Usage

1. Open the **Quests** page in Discord.
2. Press **Auto Complete** on a quest tile to run it now, or **Add to queue** to line it up.
3. Want hands-free? Open the plugin settings and set **Auto-complete all quests** to **Allow**.

## ⚙️ Settings

| Setting | Default | What it does |
|---|---|---|
| Auto-complete all quests | **Deny** | Allow = queue and finish every available quest, one at a time, 3 minutes apart |
| Run queued quests automatically | On | Pauses or resumes the queue |
| Queue priority | Videos first | Which kind of quest the queue picks first |
| New quest alerts | On | Notify when a new quest becomes available |
| Desktop notifications | Off | Allow / disallow system notifications (asks for permission) |
| Send notification | n/a | Button that triggers a test notification |
| Resume after reload | On | Continue unfinished quests after Discord restarts |
| Restart when stalled | Off | Restart a quest once if progress stops |
| Activity heartbeat | Fast | Pace of progress reports for activity quests |
| Pill appearance | n/a | Position, colors, corner radius, font size, opacity, padding |

## 🎯 Supported quests

| Quest type | Status | Notes |
|---|:---:|---|
| Watch a video | ✅ | Works in the desktop app, browser and mobile-only video quests |
| Play a game on desktop | ✅ | **Requires the Discord desktop app** |
| Stream a game | ✅ | **Requires the desktop app** and at least one other person in the voice channel |
| Play an activity | ✅ | Pace is configurable |
| Console quests (Xbox / PlayStation) | ❌ | Needs real console hardware |
| In-game achievements | ❌ | Cannot be automated |

> Quests that offer *"desktop or console"* are completed through their desktop task.

## 🩺 Troubleshooting

<details>
<summary><strong>A quest stays at 0%</strong></summary>

Game and stream quests only work in the Discord **desktop app**. Open DevTools (`Ctrl+Shift+I`), enable **Debug mode** in the plugin settings and look for lines starting with `[VenQuests]` in the console, then include them in a bug report.
</details>

<details>
<summary><strong>"Quest no longer available"</strong></summary>

The quest expired, was removed, or Discord rejected the enrollment. Accept it once from the Quests page, then run it again. If it keeps happening, open an issue with the console output.
</details>

<details>
<summary><strong>No notifications appear</strong></summary>

Turn on **Desktop notifications** and press **Send notification**. If permission shows as *Blocked*, re-enable notifications for Discord in your operating system settings.
</details>

## 🛠️ Development

```bash
npm ci
npm run check     # typecheck + lint + format + tests
npm test          # unit tests only
```

Stack: TypeScript (strict), React via Vencord, Vitest, ESLint, Prettier, GitHub Actions. See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## 🗺️ Roadmap

- [x] Auto-complete all quests with spacing between runs
- [x] New quest notifications
- [ ] Per-quest-type allow list for auto-complete
- [ ] Quest history and reward log
- [ ] Per-reward filters (only run quests worth X orbs or an item)

## 🤝 Contributing

Bug reports, ideas and pull requests are welcome:
[Report a bug](https://github.com/Anaaasdh/vencord-quests/issues/new?template=bug_report.yml) ·
[Request a feature](https://github.com/Anaaasdh/vencord-quests/issues/new?template=feature_request.yml)

## 👤 Author

<table>
  <tr>
    <td align="center" width="160">
      <a href="https://github.com/Anaaasdh"><img src="https://github.com/Anaaasdh.png?size=160" width="96" height="96" alt="Anasdh" style="border-radius:50%"/></a>
    </td>
    <td>
      <strong>Anasdh</strong><br/>
      <a href="https://github.com/Anaaasdh"><img src="https://img.shields.io/badge/GitHub-Anaaasdh-181717?style=flat-square&logo=github" alt="GitHub"/></a>
      <a href="https://discord.com/users/618227435745312768"><img src="https://img.shields.io/badge/Discord-Anasdh-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord"/></a>
    </td>
  </tr>
</table>

## 📄 License

Licensed under **AGPL-3.0-only**, see [LICENSE](LICENSE).

<p align="center">
  <img src=".assets/banner-bottom.svg" width="100%" alt="VenQuests"/>
</p>
