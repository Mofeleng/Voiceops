"use client";

import { screenAtom } from "../atoms/widget-atoms";
import { WidgetAuthScreen } from "./screens/widget-auth-screen";
import { useAtomValue } from "jotai";

interface Props {
    organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
    const screen = useAtomValue(screenAtom);

    const screenComponents = {
        error: <p>TODO: Error</p>,
        loading: <p>TODO: Loading</p>,
        auth: <WidgetAuthScreen />,
        inbox: <p>TODO: Inbox</p>,
        chat: <p>TODO: Chat</p>,
        voice: <p>TODO: Voice</p>,
        selection: <p>TODO: Selection</p>,
        contact: <p>TODO: Contact</p>,
    }
    return (
        <main className="flex min-h-screen min-w-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
           { screenComponents[screen]}
        </main>
    )
}