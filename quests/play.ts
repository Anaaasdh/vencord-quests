/*!
 * Questcord, a Vencord plugin that automates Discord Quests
 * Copyright (c) 2026 zpt0
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

import { discordApiGet } from "../core/api";
import { Quest, QUEST_TASK_TYPES, getTaskConfig } from "../core/types";
import { completeDesktopQuest, DesktopQuestConfig } from "./desktopBase";

function makePlayConfig(taskName: string): DesktopQuestConfig {
    const progressOf = (quest: any) => quest?.userStatus?.progress?.[taskName]?.value;
    return {
        taskName,
        questType: "Play",
        progressKey: taskName,
        spoofLabel: "Auto-completing:",
        defaultQuestName: "Play Quest",
        // minified export names change every build; keep this matcher loose
        getStoreModule: (modules) =>
            modules.find((x: any) => x?.exports?.Ay?.getRunningGames)?.exports?.Ay ||
            modules.find((x: any) => x?.exports?.ZP?.getRunningGames)?.exports?.ZP,
        // discord matches the running process against the app's real executable
        loadAppData: async (applicationId) => {
            const res = await discordApiGet(
                `/applications/public?application_ids=${applicationId}`
            );
            return (Array.isArray(res) ? res : res?.body)?.[0] ?? null;
        },
        spoofStore: (store, applicationId, pid, appName, appData) => {
            const realGetRunningGames = store.getRunningGames;
            const realGetGameForPID = store.getGameForPID;

            const name: string = appData?.name || appName;
            const exeName: string =
                appData?.executables?.find((x: any) => x.os === "win32")?.name?.replace(">", "") ||
                `${name.toLowerCase().replace(/\s+/g, "")}.exe`;
            const fakeGame = {
                cmdLine: `C:\\Program Files\\${name}\\${exeName}`,
                exeName,
                exePath: `c:/program files/${name.toLowerCase()}/${exeName}`,
                hidden: false,
                isLauncher: false,
                id: applicationId,
                name,
                pid,
                pidPath: [pid],
                processName: name,
                start: Date.now(),
            };

            const fakeGames = [fakeGame];
            store.getRunningGames = () => fakeGames;
            store.getGameForPID = (checkPid: number) =>
                fakeGames.find((x: any) => x.pid === checkPid);

            const realGames = realGetRunningGames.call(store);
            return {
                realFunc: {
                    getRunningGames: realGetRunningGames,
                    getGameForPID: realGetGameForPID,
                },
                fakeData: { fakeGame, fakeGames, realGames },
            };
        },
        // without this event discord never notices the "game" and sends no heartbeats
        afterSpoof: (dispatcher, { fakeGame, fakeGames, realGames }) => {
            dispatcher.dispatch({
                type: "RUNNING_GAMES_CHANGE",
                removed: realGames,
                added: [fakeGame],
                games: fakeGames,
            });
        },
        beforeRestore: (dispatcher, { fakeGame, realGames }) => {
            dispatcher.dispatch({
                type: "RUNNING_GAMES_CHANGE",
                removed: [fakeGame],
                added: [],
                games: realGames ?? [],
            });
        },
        dispatchEvent: "RUNNING_GAMES_CHANGE",
        restoreStore: (store, realFunc) => {
            store.getRunningGames = realFunc.getRunningGames;
            store.getGameForPID = realFunc.getGameForPID;
        },
        getProgressFromQuest: (quest, lastFallback) =>
            Math.floor(
                progressOf(quest) ?? quest?.userStatus?.streamProgressSeconds ?? lastFallback
            ),
        getProgressFromHeartbeat: (data, lastFallback) =>
            Math.floor(
                progressOf(data?.liveQuest) ??
                    data?.userStatus?.progress?.[taskName]?.value ??
                    data?.progress?.[taskName]?.value ??
                    data?.userStatus?.streamProgressSeconds ??
                    lastFallback
            ),
    };
}

export async function completePlayQuest(quest: Quest, userId: string): Promise<boolean> {
    const tasks = getTaskConfig(quest)?.tasks;
    const taskName =
        (QUEST_TASK_TYPES.PLAY as readonly string[]).find((t) => tasks?.[t] != null) ??
        "PLAY_ON_DESKTOP";
    return completeDesktopQuest(quest, userId, makePlayConfig(taskName));
}
