/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 * Copyright (c) 2026 zpt0
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

import type { Quest } from "../../core/types";
import { isQueueable } from "./order";

/** Pause between two auto-completed quests so they never overlap. */
export const AUTO_COMPLETE_GAP_MS = 3 * 60 * 1000;

/** Milliseconds still to wait before the next quest may start (0 when free). */
export function cooldownRemaining(
    lastEndedAt: number,
    now = Date.now(),
    gap = AUTO_COMPLETE_GAP_MS
): number {
    if (!lastEndedAt) return 0;
    return Math.max(0, lastEndedAt + gap - now);
}

/** Quest ids that auto-complete should add to the queue (never offered before). */
export function pickAutoQueue(
    quests: readonly Quest[],
    offered: ReadonlySet<string>,
    now = Date.now()
): string[] {
    return quests.filter((q) => isQueueable(q, now) && !offered.has(q.id)).map((q) => q.id);
}
