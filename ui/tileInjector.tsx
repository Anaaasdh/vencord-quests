/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 * Copyright (c) 2026 Anasdh
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { React, ReactDOM } from "@webpack/common";

import { LOG_PREFIX } from "../constants";
import { debugLog } from "../core/state";
import { normalizeQuestTileId } from "../core/utils";
import { isQueueable } from "../quests/queue/order";
import { safeGetQuest } from "../quests/queue/runner";
import { ErrorBoundary } from "./ErrorBoundary";
import { QuestButton } from "./QuestButton";

/**
 * Fallback for the tile patches in ./patches.tsx.
 *
 * The patches match Discord's minified tile code, which changes on every redesign. When none of
 * them applies a tile ends up without a button. This watches the DOM for quest tiles
 * (id="quest-tile-<id>") that have no button and mounts one at the bottom of the tile, so the
 * button survives Discord updates. Tiles the patches already handled are left alone.
 */

const TILE_SELECTOR = '[id^="quest-tile-"]';
const HOST_ATTR = "data-vc-questcord-host";
const SCAN_DELAY_MS = 350;
const SCAN_INTERVAL_MS = 3000;

interface Mounted {
    root: { render(node: React.ReactNode): void; unmount(): void };
    questId: string;
}

const mounted = new Map<HTMLElement, Mounted>();
let observer: MutationObserver | undefined;
let interval: ReturnType<typeof setInterval> | undefined;
let pending: ReturnType<typeof setTimeout> | undefined;

function LiveButton({ questId }: { questId: string }) {
    // the store replaces quest objects when they change, so read it again on every tick
    const [, tick] = React.useReducer((n: number) => n + 1, 0);
    React.useEffect(() => {
        const timer = setInterval(tick, 500);
        return () => clearInterval(timer);
    }, []);

    const quest = safeGetQuest(questId);
    if (!quest || !isQueueable(quest)) return null;
    return (
        <ErrorBoundary>
            <QuestButton quest={quest} />
        </ErrorBoundary>
    );
}

function unmountHost(host: HTMLElement) {
    const entry = mounted.get(host);
    mounted.delete(host);
    try {
        entry?.root.unmount();
    } catch {}
    try {
        host.remove();
    } catch {}
}

function mountHost(tile: HTMLElement, questId: string) {
    const host = document.createElement("div");
    host.setAttribute(HOST_ATTR, questId);
    // inline styles on purpose: vencord's managed stylesheet may not be mounted yet
    host.style.cssText =
        "display:flex;box-sizing:border-box;width:100%;padding:0 12px 12px;margin-top:-4px;";
    tile.appendChild(host);

    const root = (ReactDOM as any).createRoot(host);
    root.render(<LiveButton questId={questId} />);
    mounted.set(host, { root, questId });
}

function scan() {
    pending = undefined;

    for (const host of [...mounted.keys()]) {
        if (!host.isConnected) unmountHost(host);
    }

    document.querySelectorAll<HTMLElement>(TILE_SELECTOR).forEach((tile) => {
        // nested ids belong to the same tile
        if (tile.parentElement?.closest(TILE_SELECTOR)) return;

        const questId = normalizeQuestTileId(tile.id);
        if (!questId) return;

        // a button from the patches is already there
        if (tile.querySelector(".vc-questcord-tile-btn, .vc-questcord-footer-row")) return;

        const host = tile.querySelector<HTMLElement>(`[${HOST_ATTR}]`);
        if (host) {
            // discord recycled this tile for another quest
            if (host.getAttribute(HOST_ATTR) === questId) return;
            unmountHost(host);
        }

        if (!isQueueable(safeGetQuest(questId))) return;
        try {
            mountHost(tile, questId);
            debugLog(`${LOG_PREFIX} Mounted fallback button on tile ${questId}`);
        } catch (err) {
            console.warn(`${LOG_PREFIX} Could not mount the fallback button:`, err);
        }
    });
}

function scheduleScan() {
    if (pending) return;
    pending = setTimeout(scan, SCAN_DELAY_MS);
}

export function startTileInjector() {
    stopTileInjector();
    observer = new MutationObserver(scheduleScan);
    observer.observe(document.body, { childList: true, subtree: true });
    interval = setInterval(scheduleScan, SCAN_INTERVAL_MS);
    scheduleScan();
}

export function stopTileInjector() {
    observer?.disconnect();
    observer = undefined;
    if (interval) clearInterval(interval);
    interval = undefined;
    if (pending) clearTimeout(pending);
    pending = undefined;
    for (const host of [...mounted.keys()]) unmountHost(host);
}
