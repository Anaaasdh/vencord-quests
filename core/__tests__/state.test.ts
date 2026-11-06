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

import { describe, it, expect, beforeEach } from "vitest";
import {
    activeQuests,
    progressBars,
    cleanupFunctions,
    isPluginStopping,
    setPluginStopping,
    getProgressBarKey,
    parseProgressBarKey,
    debugLog,
} from "../state";

describe("getProgressBarKey", () => {
    it("creates key from questId and userId", () => {
        expect(getProgressBarKey("q1", "u1")).toBe("q1:u1");
    });

    it("handles empty strings", () => {
        expect(getProgressBarKey("", "")).toBe(":");
    });

    it("handles special characters", () => {
        expect(getProgressBarKey("quest-123", "user-456")).toBe("quest-123:user-456");
    });
});

describe("parseProgressBarKey", () => {
    it("parses valid key", () => {
        const result = parseProgressBarKey("q1:u1");
        expect(result).toEqual({ questId: "q1", userId: "u1" });
    });

    it("returns null for key without separator", () => {
        expect(parseProgressBarKey("noseparator")).toBeNull();
    });

    it("returns null for key with multiple separators", () => {
        expect(parseProgressBarKey("a:b:c")).toBeNull();
    });

    it("handles empty parts", () => {
        const result = parseProgressBarKey(":");
        expect(result).toEqual({ questId: "", userId: "" });
    });
});

describe("setPluginStopping", () => {
    beforeEach(() => {
        setPluginStopping(false);
    });

    it("sets isPluginStopping", () => {
        setPluginStopping(true);
        expect(isPluginStopping).toBe(true);
        setPluginStopping(false);
        expect(isPluginStopping).toBe(false);
    });
});

describe("state maps", () => {
    beforeEach(() => {
        activeQuests.clear();
        progressBars.clear();
        cleanupFunctions.clear();
    });

    it("activeQuests starts empty", () => {
        expect(activeQuests.size).toBe(0);
    });

    it("progressBars starts empty", () => {
        expect(progressBars.size).toBe(0);
    });

    it("cleanupFunctions starts empty", () => {
        expect(cleanupFunctions.size).toBe(0);
    });
});

describe("debugLog", () => {
    it("does not throw when no debug store set", () => {
        expect(() => debugLog("test")).not.toThrow();
    });
});
