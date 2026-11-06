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

import { describe, expect, it } from "vitest";
import { AUTO_COMPLETE_GAP_MS, cooldownRemaining, pickAutoQueue } from "./autoComplete";

const task = { tasks: { WATCH_VIDEO: { target: 10 } } };
const q = (id: string, extra: any = {}) => ({ id, config: { taskConfig: task }, ...extra });

describe("cooldownRemaining", () => {
    it("is 0 when nothing ended yet", () => {
        expect(cooldownRemaining(0, 1000)).toBe(0);
    });
    it("counts down the 3 minute gap", () => {
        expect(cooldownRemaining(1000, 1000)).toBe(AUTO_COMPLETE_GAP_MS);
        expect(cooldownRemaining(1000, 1000 + AUTO_COMPLETE_GAP_MS - 1)).toBe(1);
        expect(cooldownRemaining(1000, 1000 + AUTO_COMPLETE_GAP_MS)).toBe(0);
    });
});

describe("pickAutoQueue", () => {
    it("skips completed, expired and already offered quests", () => {
        const ids = pickAutoQueue(
            [
                q("1"),
                q("2"),
                q("3", { userStatus: { completedAt: "2026-01-01" } }),
                { id: "4", config: { taskConfig: task, expiresAt: "2000-01-01" } },
            ],
            new Set(["2"])
        );
        expect(ids).toEqual(["1"]);
    });
});
