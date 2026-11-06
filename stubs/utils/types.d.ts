/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 * Copyright (c) 2026  Anasdh
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

declare module "@utils/types" {
    enum OptionType {
        STRING = 0,
        NUMBER = 1,
        BOOLEAN = 2,
        SELECT = 3,
        MULTI_SELECT = 4,
        SLIDER = 5,
        COLOR = 6,
        COMPONENT = 7,
    }

    interface PluginDefinition {
        name: string;
        description: string;
        authors: Array<{ name: string; id?: string | bigint }>;
        settings?: any;
        required?: boolean;
        start?: () => void | Promise<void>;
        stop?: () => void | Promise<void>;
        patches?: any[];
        contextMenus?: Record<string, any>;
        flux?: Record<string, any>;
        [key: string]: any;
    }

    export default function definePlugin(plugin: PluginDefinition): PluginDefinition;
    export { OptionType, PluginDefinition };
}
