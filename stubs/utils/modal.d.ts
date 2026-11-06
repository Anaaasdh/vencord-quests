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

declare module "@utils/modal" {
    import React from "react";

    export interface ModalProps {
        onClose: () => void;
        [key: string]: any;
    }

    export interface ModalRootProps {
        children: React.ReactNode;
        className?: string;
        onClick?: () => void;
        onKeyDown?: (e: React.KeyboardEvent) => void;
    }

    export interface ModalHeaderProps {
        children: React.ReactNode;
        className?: string;
        separator?: boolean;
    }

    export interface ModalContentProps {
        children: React.ReactNode;
        className?: string;
    }

    export interface ModalFooterProps {
        children: React.ReactNode;
        className?: string;
    }

    export const ModalRoot: React.FC<ModalRootProps>;
    export const ModalHeader: React.FC<ModalHeaderProps>;
    export const ModalContent: React.FC<ModalContentProps>;
    export const ModalFooter: React.FC<ModalFooterProps>;

    export function openModal(
        render: (props: ModalProps) => React.ReactNode,
        options?: {
            modalKey?: string;
            onCloseRequest?: () => void;
            oncloseCallback?: () => void;
        }
    ): string;

    export function closeModal(modalKey: string): void;
    export function closeAllModals(): void;
}
