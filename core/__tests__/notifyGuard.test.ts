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

import { describe, it, expect } from "vitest";
import {
    NOTIFICATION_DEDUP_WINDOW_MS,
    buildNotificationKey,
    shouldSuppressNotification,
} from "../utils";

describe("buildNotificationKey", () => {
    it("builds distinct keys per content", () => {
        const base = buildNotificationKey("Queue", "added", "info");
        expect(buildNotificationKey("Queue", "added", "info")).toBe(base);
        expect(buildNotificationKey("Queue", "removed", "info")).not.toBe(base);
        expect(buildNotificationKey("Other", "added", "info")).not.toBe(base);
        expect(buildNotificationKey("Queue", "added", "error")).not.toBe(base);
        expect(buildNotificationKey("Queue", "added", "info", "q1")).not.toBe(base);
    });
});

describe("shouldSuppressNotification", () => {
    it("never suppresses without history", () => {
        const key = buildNotificationKey("Queue", "added", "info");
        expect(shouldSuppressNotification(null, key, 1000)).toBe(false);
    });

    it("suppresses identical keys inside the window", () => {
        const key = buildNotificationKey("Queue", "added", "info");
        const last = { key, at: 1000 };
        expect(shouldSuppressNotification(last, key, 1000)).toBe(true);
        expect(shouldSuppressNotification(last, key, 1000 + NOTIFICATION_DEDUP_WINDOW_MS - 1)).toBe(
            true
        );
    });

    it("allows identical keys after the window", () => {
        const key = buildNotificationKey("Queue", "added", "info");
        const last = { key, at: 1000 };
        expect(shouldSuppressNotification(last, key, 1000 + NOTIFICATION_DEDUP_WINDOW_MS)).toBe(
            false
        );
        expect(shouldSuppressNotification(last, key, 60_000)).toBe(false);
    });

    it("never suppresses different keys", () => {
        const last = { key: buildNotificationKey("Queue", "added", "info"), at: 1000 };
        expect(
            shouldSuppressNotification(
                last,
                buildNotificationKey("Queue", "Now running", "info"),
                1001
            )
        ).toBe(false);
    });
});
