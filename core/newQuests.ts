/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 * Copyright (c) 2026 zpt0
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

import { getQuestName, resolveApplicationName, type Quest } from "./types";
import { isCompleted, isExpired, pickTask } from "../quests/queue/order";

/** A quest the user could still do: has a supported task, not completed, not expired. */
export function isAvailableQuest(quest: Quest | undefined, now = Date.now()): quest is Quest {
    if (!quest?.id) return false;
    return pickTask(quest) != null && !isCompleted(quest) && !isExpired(quest, now);
}

/** Quests that are available and whose id is not in `seen`. */
export function findNewQuests(
    quests: readonly Quest[],
    seen: ReadonlySet<string>,
    now = Date.now()
): Quest[] {
    return quests.filter((q) => isAvailableQuest(q, now) && !seen.has(q.id));
}

/**
 * Converts one quest from the raw REST payload (snake_case) into the shape the
 * rest of the plugin uses. Only the fields needed for availability checks and names.
 */
export function normalizeRawQuest(raw: any): Quest | null {
    if (!raw?.id) return null;
    const cfg = raw.config ?? {};
    const tasks = (cfg.task_config ?? cfg.task_config_v2)?.tasks;
    return {
        id: String(raw.id),
        config: {
            expiresAt: cfg.expires_at,
            application: cfg.application
                ? { id: cfg.application.id, name: cfg.application.name }
                : undefined,
            messages: { questName: cfg.messages?.quest_name },
            taskConfig: tasks ? { tasks } : undefined,
        },
        userStatus: raw.user_status
            ? {
                  enrolledAt: raw.user_status.enrolled_at ?? undefined,
                  completedAt: raw.user_status.completed_at ?? undefined,
              }
            : undefined,
    };
}

export function describeQuest(quest: Quest): string {
    const name = getQuestName(quest, "");
    const app = resolveApplicationName(quest);
    if (name && app !== "Unknown App" && !name.includes(app)) return `${name} (${app})`;
    return name || (app !== "Unknown App" ? app : "New quest");
}
