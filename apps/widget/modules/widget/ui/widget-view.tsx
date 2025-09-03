"use client";

import { screenAtom } from "../atoms/widget-atoms";
import { WidgetAuthScreen } from "./screens/widget-auth-screen";
import { useAtomValue } from "jotai";
import { WidgetErrorScreen } from "./screens/widget-error-screen";
import { WidgetLoadingScreen } from "./screens/widget-loading-screen";
import { WidgetSelectionScreen } from "./screens/widget-selection-screen";
import { WidgetChatScreen } from "./screens/widget-chat-screen";
import { WidgetInboxScreen } from "./screens/widget-inbox-screen";

interface Props {
    organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <WidgetErrorScreen />,
        loading: <WidgetLoadingScreen organizationId={organizationId}/>,
        auth: <WidgetAuthScreen />,
        inbox: <WidgetInboxScreen />,
        chat: <WidgetChatScreen />,
        voice: <p>TODO: Voice</p>,
        selection: <WidgetSelectionScreen />,
        contact: <p>TODO: Contact</p>,
    }
    return (
        <main className="flex min-h-screen max-w-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
           { screenComponents[screen]}
        </main>
    )
}