"use client";

import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import {  LoaderIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId }: { organizationId: string|null}) => {
    const [ step, setStep ] = useState<InitStep>("org");
    const [ sessionValid, setSessionValid ] = useState(false);

    const setOrganizationId = useSetAtom(organizationIdAtom);

    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setErrorMessage  = useSetAtom(errorMessageAtom);
    const setScreen = useSetAtom(screenAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));

    const validateOrganization = useAction(api.public.organizations.validate);

    //validate organisation
    useEffect(() => {
        if(step !== "org") {
            return;
        }

        setLoadingMessage("Loading organization");

        if (!organizationId) {
            setErrorMessage("Organization ID is required");
            setScreen("error");
            return;
        }
        
        setLoadingMessage("Verifying organization...");

        validateOrganization({ organizationId })
            .then((result) => {
                if (result.valid) {
                    setOrganizationId(organizationId);
                    setStep("session");
                } else {
                    setErrorMessage(result.reason || "Inavalid configuration");
                    setScreen("error");
                }
            })
            .catch(() => {
                setErrorMessage("Unable to verify organization");
                setScreen("error");
            })
    }, [
        step,
        organizationId,
        setErrorMessage,
        setScreen,
        setOrganizationId,
        setStep,
        validateOrganization
    ]);

    //validate session
    const validateContactSession = useMutation(api.public.contactSessions.validate);
    useEffect(() => {
        if (step !== "session") {
            return;
        }

        setLoadingMessage("Finding contact session ID...");

        if (!contactSessionId) {
            setSessionValid(false);
            setStep("done");
            return;
        }

        setLoadingMessage("Validating session...");

        validateContactSession({
            contactSessionId: contactSessionId
        }) 
            .then((result) => {
                setSessionValid(result.valid);
                setStep("done");
            })
            .catch(() => {
                setSessionValid(false);
                setStep("done");
            })

    }, [
        step,
        contactSessionId,
        validateContactSession,
        setLoadingMessage
    ]);

    useEffect(() => {
        if (step !== "done") {
            return;
        }

        const hasValidSession = contactSessionId && sessionValid;
        
        setScreen(hasValidSession ? "selection" : "auth");
    }, [
        step,
        setScreen,
        contactSessionId,
        sessionValid
    ])
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
                <LoaderIcon className="animate-spin" />
                <p className="text-sm">
                    { loadingMessage || "Loading" }
                </p>
            </div>
        </>
    )
}