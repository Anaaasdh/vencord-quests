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

declare module "@webpack/common" {
    import React from "react";
    import ReactDOM from "react-dom";

    const Menu: {
        Menu: React.FC<any>;
        MenuItem: React.FC<any>;
        MenuGroup: React.FC<any>;
        MenuSeparator: React.FC<any>;
        MenuCheckboxItem: React.FC<any>;
        MenuRadioItem: React.FC<any>;
        MenuText: React.FC<any>;
        MenuSearch: React.FC<any>;
        MenuControlItem: React.FC<any>;
    };

    const Select: React.FC<any>;

    const Slider: React.FC<any>;

    const Switch: React.FC<any>;

    const RestAPI: {
        get(options: {
            url: string;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
        post(options: {
            url: string;
            body?: any;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
        patch(options: {
            url: string;
            body?: any;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
        put(options: {
            url: string;
            body?: any;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
        delete(options: {
            url: string;
            body?: any;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
        del(options: {
            url: string;
            body?: any;
            query?: Record<string, any>;
        }): Promise<{ body: any; status: number }>;
    };

    const GuildStore: {
        getGuild(guildId: string): any;
        getGuilds(): Record<string, any>;
        getMutableGuilds(): Record<string, any>;
    };

    const GuildRoleStore: {
        getSortedRoles(guildId: string): any[];
        getRoles(guildId: string): Record<string, any>;
    };

    const GuildChannelStore: {
        getChannels(guildId: string): any;
        getMutableGuildChannelsForGuild(guildId: string): Record<string, any>;
        getChannel(channelId: string): any;
    };

    const UserStore: {
        getCurrentUser(): any;
        getUser(userId: string): any;
        getUsers(): Record<string, any>;
    };

    const SearchableSelect: React.FC<any>;

    const Checkbox: React.FC<any>;

    const NavigationRouter: {
        transitionTo(path: string): void;
        back(): void;
        forward(): void;
    };

    const ChannelStore: {
        getChannel(channelId: string): any;
        getChannels(guildId: string): any;
    };

    const InviteActions: {
        resolveInvite(
            code: string,
            context: string
        ): Promise<{ invite: { guild: { id: string }; channel: { id: string } } | null }>;
    };

    const Parser: {
        parse(content: string, allowLinks?: boolean): any;
    };

    const Popout: React.FC<{
        position?: "top" | "bottom" | "left" | "right";
        align?: "top" | "center" | "bottom" | "left" | "right";
        spacing?: number;
        targetElementRef?: React.RefObject<any>;
        renderPopout?: (info?: any) => React.ReactNode;
        animation?: unknown;
        LustreAnimation?: unknown;
        children: (props: Record<string, any>) => React.ReactNode;
    }>;

    export {
        React,
        ReactDOM,
        Menu,
        Select,
        Slider,
        Switch,
        RestAPI,
        GuildStore,
        GuildRoleStore,
        GuildChannelStore,
        UserStore,
        SearchableSelect,
        Checkbox,
        NavigationRouter,
        ChannelStore,
        InviteActions,
        Parser,
        Popout,
    };
}
