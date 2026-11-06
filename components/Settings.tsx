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

import "./settings.css";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { Switch } from "@components/Switch";
import { classNameFactory } from "@utils/css";
import { React, Select, Slider } from "@webpack/common";

import { clearSavedQuestStates } from "../quests/manager";
import { scheduleTick } from "../quests/queue/runner";
import { settings } from "../settings";
import { notify } from "../ui/notifications";
import {
    getDesktopPermission,
    requestDesktopPermission,
    sendTestNotification,
    type DesktopPermission,
} from "../ui/questAlerts";
import { ColorPicker } from "./ColorPicker";
import { QueueSettings } from "./QueueSettings";
import { VersionDisplay } from "./VersionDisplay";

const cl = classNameFactory("vc-questcord-settings-");

function getDefaults(): Record<string, any> {
    const defaults: Record<string, any> = {};
    for (const [key, def] of Object.entries(settings.def as Record<string, any>)) {
        if (def.default !== undefined) {
            defaults[key] = def.default;
        }
    }
    return defaults;
}

const ALL_SETTINGS = getDefaults();

const CUSTOM_SETTINGS: Record<string, any> = {
    pillPosition: ALL_SETTINGS.pillPosition,
    pillBgColor: ALL_SETTINGS.pillBgColor,
    pillAccentColor: ALL_SETTINGS.pillAccentColor,
    pillTextColor: ALL_SETTINGS.pillTextColor,
    pillPercentColor: ALL_SETTINGS.pillPercentColor,
    pillBarBgColor: ALL_SETTINGS.pillBarBgColor,
    pillBorderColor: ALL_SETTINGS.pillBorderColor,
    pillBorderRadius: ALL_SETTINGS.pillBorderRadius,
    pillFontSize: ALL_SETTINGS.pillFontSize,
    pillOpacity: ALL_SETTINGS.pillOpacity,
    pillPadding: ALL_SETTINGS.pillPadding,
};

// values must match the qc-pos-* classes in ui/pillStyles.ts
const POSITION_OPTIONS = [
    { label: "Top Left", value: "top-left" },
    { label: "Top Center", value: "top-center" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Center", value: "bottom-center" },
    { label: "Bottom Right", value: "bottom-right" },
];

// values are read by the quest runner, keep in sync or heartbeats fall back
const AUTO_COMPLETE_OPTIONS = [
    { label: "Deny", value: "deny" },
    { label: "Allow", value: "allow" },
];

const HEARTBEAT_OPTIONS = [
    { label: "Fast (~1s, previous behaviour)", value: "fast" },
    { label: "Balanced (~20s)", value: "balanced" },
    { label: "Official pace (~60s)", value: "official" },
];

function SettingSlider({
    settingKey,
    label,
    note,
    min,
    max,
    markers,
    unit = "px",
}: {
    settingKey: string;
    label: string;
    note?: string;
    min: number;
    max: number;
    markers?: number[];
    unit?: string;
}) {
    const value = settings.use([settingKey as any])[settingKey];
    return (
        <div className={cl("setting-item")}>
            <Heading>{label}</Heading>
            {note && <Paragraph style={{ marginBottom: 8 }}>{note}</Paragraph>}
            <Slider
                initialValue={value}
                onValueChange={(v: number) => (settings.store[settingKey] = v)}
                minValue={min}
                maxValue={max}
                markers={markers}
                onValueRender={(v: number) => `${v}${unit}`}
            />
        </div>
    );
}

function SettingToggle({
    settingKey,
    label,
    note,
}: {
    settingKey: string;
    label: string;
    note?: string;
}) {
    const value = settings.use([settingKey as any])[settingKey];
    return (
        <div className={cl("setting-item")}>
            <div className={cl("toggle-row")}>
                <div className={cl("toggle-label")}>
                    <Heading style={{ marginBottom: 0 }}>{label}</Heading>
                    {note && <Paragraph>{note}</Paragraph>}
                </div>
                <Switch
                    checked={!!value}
                    onChange={(checked: boolean) => (settings.store[settingKey] = checked)}
                />
            </div>
        </div>
    );
}

function SettingSelect({
    settingKey,
    label,
    note,
    options,
    onChange,
}: {
    settingKey: string;
    label: string;
    note?: string;
    options: Array<{ label: string; value: string }>;
    onChange?: (value: string) => void;
}) {
    const value = settings.use([settingKey as any])[settingKey];
    return (
        <div className={cl("setting-item")}>
            <Heading>{label}</Heading>
            {note && <Paragraph style={{ marginBottom: 8 }}>{note}</Paragraph>}
            <Select
                options={options}
                select={(v: string) => {
                    settings.store[settingKey] = v;
                    onChange?.(v);
                }}
                isSelected={(v: string) => v === value}
                serialize={(v: string) => v}
            />
        </div>
    );
}

function SettingColor({
    settingKey,
    label,
    note,
}: {
    settingKey: string;
    label: string;
    note?: string;
}) {
    const value = settings.use([settingKey as any])[settingKey];
    return (
        <div className={cl("setting-item")}>
            <div className={cl("color-row")}>
                <div className={cl("color-label")}>
                    <Heading>{label}</Heading>
                    {note && <Paragraph>{note}</Paragraph>}
                </div>
                <ColorPicker
                    value={value}
                    onChange={(hex: string) => (settings.store[settingKey] = hex)}
                />
            </div>
        </div>
    );
}

const PERMISSION_LABEL: Record<DesktopPermission, string> = {
    granted: "Allowed",
    denied: "Blocked (change it in your system / Discord notification settings)",
    default: "Not asked yet",
    unsupported: "Not supported here",
};

function NewQuestAlerts() {
    const { desktopNotifications } = settings.use(["desktopNotifications"]);
    const [permission, setPermission] = React.useState<DesktopPermission>(getDesktopPermission());

    const allow = React.useCallback(async () => {
        setPermission(await requestDesktopPermission());
    }, []);

    return (
        <>
            <SettingToggle
                settingKey="notifyNewQuests"
                label="New quest alerts"
                note="Get notified when a new quest becomes available"
            />
            <div className={cl("setting-item")}>
                <div className={cl("toggle-row")}>
                    <div className={cl("toggle-label")}>
                        <Heading style={{ marginBottom: 0 }}>Desktop notifications</Heading>
                        <Paragraph>
                            Allow / disallow system notifications. Permission:{" "}
                            {PERMISSION_LABEL[permission]}
                        </Paragraph>
                    </div>
                    <Switch
                        checked={!!desktopNotifications}
                        onChange={(checked: boolean) => {
                            settings.store.desktopNotifications = checked;
                            if (checked) void allow();
                        }}
                    />
                </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
                <button
                    className={cl("check-update-btn")}
                    style={{ flex: 1 }}
                    onClick={async () => setPermission(await sendTestNotification())}
                >
                    Send notification
                </button>
            </div>
        </>
    );
}

export function QuestSettings() {
    return (
        <div className={cl("root")}>
            <VersionDisplay />

            <QueueSettings />

            <section title="Notifications">
                <SettingToggle
                    settingKey="showNotifications"
                    label="Show notifications"
                    note="Toast notifications for quest events"
                />
                <SettingSlider
                    settingKey="notificationDuration"
                    label="Notification duration"
                    note="How long notifications stay on screen"
                    min={1}
                    max={10}
                    markers={[1, 2, 3, 4, 6, 8, 10]}
                    unit="s"
                />
                <NewQuestAlerts />
            </section>

            <section title="Automation">
                <SettingToggle
                    settingKey="autoResumeAfterReload"
                    label="Resume after reload"
                    note="Continue unfinished quest automation after Discord reloads"
                />
                <SettingToggle
                    settingKey="showProgressBar"
                    label="Show progress bar"
                    note="Display a progress bar for active quests"
                />
                <SettingToggle
                    settingKey="autoDismissQuestPopups"
                    label="Dismiss quest popups"
                    note="Automatically close quest video and mobile QR code popups"
                />
                <SettingToggle
                    settingKey="autoRestartStalled"
                    label="Restart when stalled"
                    note="Restart quest automation once when progress stops (off by default)"
                />
                <SettingSelect
                    settingKey="autoCompleteAll"
                    label="Auto-complete all quests"
                    note="Allow: every available quest is completed automatically, one at a time, with a 3 minute pause between quests. Deny (default): only what you start or queue yourself"
                    options={AUTO_COMPLETE_OPTIONS}
                    onChange={() => scheduleTick()}
                />
                <SettingSelect
                    settingKey="activityHeartbeat"
                    label="Activity heartbeat"
                    note="How often activity quests report progress (slower is safer on rate limits)"
                    options={HEARTBEAT_OPTIONS}
                />
            </section>

            <section title="Pill position">
                <SettingSelect
                    settingKey="pillPosition"
                    label="Position"
                    note="Where quest progress pills appear on screen"
                    options={POSITION_OPTIONS}
                />
            </section>

            <section title="Pill colors">
                <div className={cl("color-grid")}>
                    <SettingColor
                        settingKey="pillBgColor"
                        label="Background"
                        note="Pill background color"
                    />
                    <SettingColor
                        settingKey="pillAccentColor"
                        label="Accent"
                        note="Progress bars, spinners, highlights"
                    />
                    <SettingColor
                        settingKey="pillTextColor"
                        label="Text"
                        note="Pill title text color"
                    />
                    <SettingColor
                        settingKey="pillPercentColor"
                        label="Percent"
                        note="Progress percent text color"
                    />
                    <SettingColor
                        settingKey="pillBarBgColor"
                        label="Bar Background"
                        note="Progress bar track color"
                    />
                    <SettingColor
                        settingKey="pillBorderColor"
                        label="Border"
                        note="Pill border color"
                    />
                </div>
            </section>

            <section title="Pill appearance">
                <SettingSlider
                    settingKey="pillBorderRadius"
                    label="Corner Radius"
                    note="Pill corner roundness"
                    min={0}
                    max={32}
                    markers={[0, 8, 16, 24, 32]}
                />
                <SettingSlider
                    settingKey="pillFontSize"
                    label="Font Size"
                    note="Pill text size"
                    min={10}
                    max={20}
                    markers={[10, 12, 14, 16, 18, 20]}
                />
                <SettingSlider
                    settingKey="pillOpacity"
                    label="Opacity"
                    note="Pill background transparency"
                    min={50}
                    max={100}
                    markers={[50, 60, 70, 80, 85, 90, 95, 100]}
                    unit="%"
                />
                <SettingSlider
                    settingKey="pillPadding"
                    label="Padding"
                    note="Pill inner spacing"
                    min={4}
                    max={16}
                    markers={[4, 6, 8, 10, 12, 16]}
                />
            </section>

            <section title="Reset">
                <div style={{ display: "flex", gap: 8 }}>
                    <button
                        className={cl("check-update-btn")}
                        style={{ flex: 1 }}
                        onClick={() => {
                            for (const [key, val] of Object.entries(CUSTOM_SETTINGS)) {
                                (settings.store as any)[key] = val;
                            }
                        }}
                    >
                        Reset Customization
                    </button>
                    <button
                        className={cl("check-update-btn")}
                        style={{ flex: 1 }}
                        onClick={() => {
                            for (const [key, val] of Object.entries(ALL_SETTINGS)) {
                                (settings.store as any)[key] = val;
                            }
                        }}
                    >
                        Reset All Settings
                    </button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <button
                        className={cl("check-update-btn")}
                        style={{ flex: 1 }}
                        onClick={() => {
                            clearSavedQuestStates().then(() => {
                                notify("Cleared", "Saved quest resume states cleared", "info");
                            });
                        }}
                    >
                        Clear Saved Quests
                    </button>
                </div>
            </section>
        </div>
    );
}
