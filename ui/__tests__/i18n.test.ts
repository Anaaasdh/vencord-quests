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

import { resolveMessages, translateMessage } from "../i18n";

describe("ui/i18n", () => {
    it("resolves the English dictionary as base", () => {
        expect(resolveMessages("en-US").autoComplete).toBe("Auto Complete");
        expect(resolveMessages("unknown-x").addToQueue).toBe("Add to queue");
        expect(resolveMessages(undefined).cancel).toBe("Cancel");
    });

    it("overlays locale-specific translations on the base dictionary", () => {
        const messages = resolveMessages("de");
        expect(messages.autoComplete).not.toBe("Auto Complete");

        expect(messages.collecting).toBe("Orbs werden gesammelt...");
        expect(translateMessage("de-DE", "addToQueue")).toBe("Zur Warteschlange hinzufügen");
    });

    it("supports all 10 supported locales", () => {
        const locales = ["en-US", "de", "fr", "es", "it", "pt", "ru", "ja", "ko", "zh"];
        for (const locale of locales) {
            const messages = resolveMessages(locale);
            expect(messages.autoComplete).toBeTruthy();
            expect(messages.addToQueue).toBeTruthy();
            expect(messages.queue).toBeTruthy();
            expect(messages.cancel).toBeTruthy();
        }
    });

    it("falls back to English for unknown locales", () => {
        expect(resolveMessages("xx-XX").cancel).toBe("Cancel");
        expect(resolveMessages(null).addToQueue).toBe("Add to queue");
    });

    it("substitutes variables in messages", () => {
        expect(translateMessage("en-US", "queueCount", { count: 3 })).toBe("Queue (3)");
        expect(translateMessage("de", "statusRunning", { percent: " 42%" })).toBe("Läuft 42%");

        expect(translateMessage("en-US", "queueCount")).toBe("Queue ({count})");
    });
});
