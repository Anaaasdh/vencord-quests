/*!
 * Questcord, a Vencord plugin that automates Discord Quests

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

declare module "@api/Settings" {
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

    interface SettingDefinitionBase {
        type: OptionType;
        description: string;
        restartNeeded?: boolean;
    }

    interface StringOption extends SettingDefinitionBase {
        type: OptionType.STRING;
        default?: string;
        validators?: Array<(value: string) => boolean | string>;
    }

    interface NumberOption extends SettingDefinitionBase {
        type: OptionType.NUMBER;
        default?: number;
        markers?: number[];
        stickToMarkers?: boolean;
    }

    interface BooleanOption extends SettingDefinitionBase {
        type: OptionType.BOOLEAN;
        default?: boolean;
    }

    interface SelectOption extends SettingDefinitionBase {
        type: OptionType.SELECT;
        options: { label: string; value: any; default?: boolean }[];
    }

    interface MultiSelectOption extends SettingDefinitionBase {
        type: OptionType.MULTI_SELECT;
        options: { label: string; value: any; default?: boolean }[];
    }

    interface SliderOption extends SettingDefinitionBase {
        type: OptionType.SLIDER;
        default?: number;
        markers: number[];
        stickToMarkers?: boolean;
    }

    interface ColorOption extends SettingDefinitionBase {
        type: OptionType.COLOR;
        default?: string;
    }

    interface ComponentOption extends SettingDefinitionBase {
        type: OptionType.COMPONENT;
        component: React.ComponentType<any>;
    }

    type SettingDefinition =
        | StringOption
        | NumberOption
        | BooleanOption
        | SelectOption
        | MultiSelectOption
        | SliderOption
        | ColorOption
        | ComponentOption;

    type SettingsMap = Record<string, SettingDefinition>;

    interface SettingsOption {
        value: any;
    }

    interface Settings {
        store: Record<string, any>;
        [key: string]: SettingsOption | (() => any) | any;
        get<T>(key: string): T;
        set(key: string, value: any): void;
    }

    export function definePluginSettings(settings: Record<string, any>): Settings;
    export { OptionType, SettingDefinition, SettingsMap, Settings };
}
