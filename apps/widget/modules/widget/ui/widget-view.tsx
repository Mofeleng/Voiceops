"use client";

import { WidgetAuthScreen } from "./screens/widget-auth-screen";

interface Props {
    organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
    return (
        <main className="flex min-h-screen min-w-screen h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
           <WidgetAuthScreen />
        </main>
    )
}