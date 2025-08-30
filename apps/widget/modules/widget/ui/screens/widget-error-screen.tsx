"use client";

import { errorMessageAtom } from "../../atoms/widget-atoms";
import { useAtomValue } from "jotai";
import { AlertTriangle, AlertTriangleIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
    const errorMEssage  = useAtomValue(errorMessageAtom);

    return (
        <>
            <WidgetHeader>
                <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">
                        Hello There👋
                    </p>
                    <p className="text-lg">
                        Tell us a little about yourself
                    </p>
                </div>
            </WidgetHeader>
            <div className="flex flex-1 flex-cols items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <AlertTriangleIcon />
                <p>
                    { errorMEssage || "Invalid configuration" }
                </p>
            </div>
        </>
    )
}