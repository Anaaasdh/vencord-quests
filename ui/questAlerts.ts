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

import { DataStore } from "@api/index";
import { LOG_PREFIX } from "../constants";
import { discordApiGet } from "../core/api";
import { describeQuest, findNewQuests, normalizeRawQuest } from "../core/newQuests";
import { debugLog } from "../core/state";
import { listStoreQuests } from "../core/stores";
import type { Quest } from "../core/types";
import { currentUserId } from "../core/user";
import { settings } from "../settings";
import { t } from "./i18n";
import { notify } from "./notifications";

const SEEN_KEY_PREFIX = "questcord-seen-quests-";
const POLL_INTERVAL_MS = 30 * 60 * 1000;
const MAX_LISTED = 3;

let pollTimer: ReturnType<typeof setInterval> | undefined;
let checking = false;

export type DesktopPermission = "granted" | "denied" | "default" | "unsupported";

export function getDesktopPermission(): DesktopPermission {
    try {
        if (typeof Notification === "undefined") return "unsupported";
        return Notification.permission;
    } catch {
        return "unsupported";
    }
}

/** Shows the browser's Allow / Block prompt when the choice has not been made yet. */
export async function requestDesktopPermission(): Promise<DesktopPermission> {
    try {
        if (typeof Notification === "undefined") return "unsupported";
        if (Notification.permission === "default") await Notification.requestPermission();
    } catch (err) {
        console.warn(`${LOG_PREFIX} Notification permission request failed:`, err);
    }
    return getDesktopPermission();
}

function sendDesktopNotification(title: string, body: string): boolean {
    try {
        if (!settings.store.desktopNotifications) return false;
        if (getDesktopPermission() !== "granted") return false;
        const n = new Notification(title, { body, tag: "questcord-new-quests" });
        n.onclick = () => {
            try {
                window.focus();
            } catch {}
            n.close();
        };
        return true;
    } catch (err) {
        debugLog(`${LOG_PREFIX} Desktop notification failed:`, err);
        return false;
    }
}

/** Used by the "Send test notification" button; ignores the on/off toggles on purpose. */
export async function sendTestNotification(): Promise<DesktopPermission> {
    const permission = await requestDesktopPermission();
    const title = t("newQuestsTitle");
    const body = t("testNotificationBody");
    if (permission === "granted") {
        try {
            new Notification(title, { body, tag: "questcord-test" });
        } catch {}
    }
    notify(title, body, "info");
    return permission;
}

function announce(fresh: Quest[]) {
    const names = fresh.slice(0, MAX_LISTED).map(describeQuest);
    const extra = fresh.length - names.length;
    let body = names.join(", ");
    if (extra > 0) body += ` +${extra}`;
    const title = fresh.length === 1 ? t("newQuestTitle") : t("newQuestsTitle");
    // desktop notification when allowed, in-app pill always
    sendDesktopNotification(title, body);
    notify(title, body, "info");
}

async function loadSeen(userId: string): Promise<Set<string> | null> {
    const stored = (await DataStore.get(SEEN_KEY_PREFIX + userId)) as string[] | undefined;
    return Array.isArray(stored) ? new Set(stored) : null;
}

async function checkQuests(quests: Quest[]): Promise<void> {
    if (checking) return;
    const userId = currentUserId();
    if (!userId) return;
    checking = true;
    try {
        const seen = await loadSeen(userId);
        const fresh = findNewQuests(quests, seen ?? new Set());
        // first run for this account: remember what exists, don't announce the backlog
        if (seen && fresh.length > 0 && settings.store.notifyNewQuests) announce(fresh);
        if (!seen || fresh.length > 0) {
            const all = new Set(seen ?? []);
            for (const q of quests) if (q?.id) all.add(q.id);
            await DataStore.set(SEEN_KEY_PREFIX + userId, [...all]);
        }
    } catch (err) {
        debugLog(`${LOG_PREFIX} New quest check failed:`, err);
    } finally {
        checking = false;
    }
}

/** Called when Discord reports a fresh quest fetch. */
export function onQuestsFetched(): void {
    void checkQuests(listStoreQuests() as Quest[]);
}

async function poll(): Promise<void> {
    try {
        const data = await discordApiGet("/quests/@me", 1);
        const list: any[] = Array.isArray(data) ? data : (data?.quests ?? []);
        const quests = list.map(normalizeRawQuest).filter((q): q is Quest => q != null);
        await checkQuests(quests);
    } catch (err) {
        debugLog(`${LOG_PREFIX} Quest poll failed:`, err);
    }
}

export function startQuestAlerts(): void {
    stopQuestAlerts();
    pollTimer = setInterval(() => void poll(), POLL_INTERVAL_MS);
}

export function stopQuestAlerts(): void {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = undefined;
}
