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

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@api/index", () => {
    const mem = new Map<string, unknown>();
    return {
        DataStore: {
            get: async (key: string) => mem.get(key),
            set: async (key: string, value: unknown) => {
                mem.set(key, value);
            },
            del: async (key: string) => {
                mem.delete(key);
            },
            delete: async (key: string) => {
                mem.delete(key);
            },
            __mem: mem,
        },
    };
});

vi.mock("../stores", () => ({
    questsLoaded: () => true,
}));

import {
    getOwner,
    setOwner,
    markQuestsLoaded,
    accountReady,
    keyFor,
    loadOwned,
    resetAccountState,
} from "../account";

beforeEach(() => {
    resetAccountState();
    vi.clearAllMocks();
});

describe("core/account", () => {
    it("tracks owner and readiness", () => {
        expect(getOwner()).toBeNull();
        expect(accountReady()).toBe(false);
        setOwner("user-1", { storeMayBeLoaded: true });
        expect(getOwner()).toBe("user-1");

        expect(accountReady()).toBe(true);
        markQuestsLoaded();
        expect(accountReady()).toBe(true);
    });

    it("namespaces keys per owner", () => {
        expect(keyFor("base")).toBeNull();
        setOwner("abc");
        expect(keyFor("base")).toBe("base:abc");
    });

    it("migrates legacy keys", async () => {
        const { DataStore } = await import("@api/index");
        await DataStore.set("legacy-key", { v: 1 });
        setOwner("u9");
        const loaded = await loadOwned<{ v: number }>("legacy-key");
        expect(loaded).toEqual({ v: 1 });

        expect(await DataStore.get("legacy-key:u9")).toEqual({ v: 1 });
        expect(await DataStore.get("legacy-key")).toBeUndefined();
    });

    it("returns undefined with no owner", async () => {
        await expect(loadOwned("anything")).resolves.toBeUndefined();
    });
});
