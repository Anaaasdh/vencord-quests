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

import { describe, expect, it } from "vitest";
import { findNewQuests, normalizeRawQuest } from "../newQuests";

const task = { tasks: { WATCH_VIDEO: { target: 10 } } };
const quest = (id: string, extra: any = {}) => ({ id, config: { taskConfig: task }, ...extra });

describe("findNewQuests", () => {
    it("returns available quests that were not seen", () => {
        const res = findNewQuests([quest("1"), quest("2")], new Set(["1"]));
        expect(res.map((q) => q.id)).toEqual(["2"]);
    });
    it("ignores completed, expired and unsupported quests", () => {
        const res = findNewQuests(
            [
                quest("a", { userStatus: { completedAt: "2026-01-01" } }),
                { id: "b", config: { taskConfig: task, expiresAt: "2000-01-01" } },
                { id: "c", config: { taskConfig: { tasks: {} } } },
            ],
            new Set()
        );
        expect(res).toEqual([]);
    });
});

describe("normalizeRawQuest", () => {
    it("maps snake_case fields", () => {
        const q = normalizeRawQuest({
            id: 5,
            config: {
                expires_at: "2099-01-01",
                task_config: task,
                messages: { quest_name: "N" },
            },
            user_status: { completed_at: null },
        })!;
        expect(q.id).toBe("5");
        expect(findNewQuests([q], new Set())).toHaveLength(1);
        expect(normalizeRawQuest({})).toBeNull();
    });
});
