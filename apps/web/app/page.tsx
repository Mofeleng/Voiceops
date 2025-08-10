"use client"

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
 
export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add)
  return (
    <>
      <Authenticated>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <UserButton />
          <p>apps/web</p>
          <Button onClick={() => addUser()}>
            Add user
          </Button>
          <div className="max-w-sm w-full mx-auto">
            { JSON.stringify(users, null, 2) }
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Yo, you not signed in.</p>
        <SignInButton>Sign in!</SignInButton>
      </Unauthenticated>
    </>
    )
}