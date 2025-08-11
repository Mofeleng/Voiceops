import Vapi from "@vapi-ai/web";
import { useEffect, useState } from "react";

interface TranscriptMessage {
    role: "user" | "assistant";
    text: string;
}

export const useVapi = () => {
    const [ vapi, setVapi ] = useState<Vapi | null>(null);
    const [ isConnected, setIsConnected ] = useState(false);
    const [ isConnecting, setIsConnecting ] = useState(false);
    const [ isSpeaking, setIsSpeaking ] = useState(false);
    const [ transcript, setTranscript ] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        //Only for testing, otherwise customers will provide api key
        const vapiInstance = new Vapi("06cd28c2-b510-4d09-9c36-8763701fdd9d");
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            setIsConnected(true);
            setIsConnecting(false);
            setTranscript([]);
        });

        vapiInstance.on("call-end", () => {
            setIsConnected(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapiInstance.on("speech-start", () => {
            setIsSpeaking(true);

        })

        vapiInstance.on("speech-end", () => {
            setIsSpeaking(false);
        });

        vapiInstance.on("error", (error) => {
            console.error("VAPI Error:", error);
            setIsConnecting(false);
        });

        vapiInstance.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role: message.role === "user" ? "user" : "assistant",
                        text: message.transcript    
                    }
                ])
            }
        });

        return () => {
            vapiInstance?.stop();
        }
    }, [])

    const startCall = () => {
        setIsConnecting(true);
        if (vapi) {
            //Only for testing, otherwise customers will provide api key
            vapi.start("a84e1fdf-f795-49f6-8ce1-991485333f66");
        }
    };

    const endCall = () => {
        if (vapi) {
            vapi.stop();
        }
    };

    return {
        isSpeaking,
        isConnecting,
        isConnected,
        transcript,
        startCall,
        endCall
    }
}