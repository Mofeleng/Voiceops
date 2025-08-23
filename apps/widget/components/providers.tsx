"use client"

import * as React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { Provider } from "jotai";

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

  return (
    <ConvexProvider client={convex}>
      <Provider>
        { children }
      </Provider>
    </ConvexProvider>
    
  )
}
