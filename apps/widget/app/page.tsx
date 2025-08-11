"use client"

import { Button } from "@workspace/ui/components/button";
import { useVapi } from "@/modules/widget/hooks/use-vapi";
 
export default function Page() {
  const { startCall, endCall, isConnected, isConnecting, isSpeaking, transcript } = useVapi();
  return (
    <div className="flex flex-col min-h-screen items-center justify-center max-w-3xl mx-auto">
        <div className="flex flex-row gap-2 justify-center ">
          <Button onClick={ () => startCall()}>
            Start Call
          </Button>
          <Button onClick={ () => endCall() } variant="destructive">
            End Call
          </Button>
        </div>
        <p>isConnecting: { `${isConnecting}` }</p>
        <p>isConnected: { `${isConnected}` }</p>
        <p>isSpeaking: { `${isSpeaking}` }</p>
        <p>{ JSON.stringify(transcript) }</p>
    </div>
    
      
  )
}
