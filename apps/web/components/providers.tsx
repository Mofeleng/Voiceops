"use client"

import * as React from "react"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing convex url in environment variables");
}

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      { children }
    </ConvexProviderWithClerk>
    
  )
}
