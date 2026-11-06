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

import { describe, it, expect } from "vitest";
import {
    PLUGIN_VERSION,
    GITHUB_REPO,
    UPDATE_CHECK_URL,
    GITHUB_RELEASE_URL,
    UPDATE_CHECK_ENABLED,
    UPDATES_CHANNEL_ID,
    SUPPORT_INVITE_CODE,
} from "./constants";

describe("constants", () => {
    it("has a valid PLUGIN_VERSION", () => {
        expect(PLUGIN_VERSION).toBeDefined();
        expect(typeof PLUGIN_VERSION).toBe("string");
        expect(PLUGIN_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it("has GITHUB_REPO set", () => {
        expect(GITHUB_REPO).toBe("Anaaasdh/vencord-quests");
    });

    it("derives UPDATE_CHECK_URL from GITHUB_REPO", () => {
        expect(UPDATE_CHECK_URL).toBe(
            "https://api.github.com/repos/Anaaasdh/vencord-quests/releases/latest"
        );
    });

    it("derives GITHUB_RELEASE_URL from GITHUB_REPO", () => {
        expect(GITHUB_RELEASE_URL).toBe(
            "https://github.com/Anaaasdh/vencord-quests/releases/latest"
        );
    });

    it("enables update checks when GITHUB_REPO is set", () => {
        expect(UPDATE_CHECK_ENABLED).toBe(true);
    });

    it("has UPDATES_CHANNEL_ID as string", () => {
        expect(typeof UPDATES_CHANNEL_ID).toBe("string");
    });

    it("has SUPPORT_INVITE_CODE as string", () => {
        expect(typeof SUPPORT_INVITE_CODE).toBe("string");
        expect(SUPPORT_INVITE_CODE).toBe("sKTrAMctcy");
    });

    it("points updates at the current updates channel", () => {
        expect(UPDATES_CHANNEL_ID).toBe("1532348047697121340");
    });
});
