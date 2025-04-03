"use client";

import { Button } from "@/components/ui/button";

import { signIn, signOut, useSession } from "next-auth/react";

export function Authenticate_Button() {
  const session = useSession();
  return (
    <div>
      {session.data?.user && (
        <div>
          <Button onClick={() => signOut()}>Sign Out</Button>
        </div>
      )}
      {!session.data?.user && (
        <div>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      )}
    </div>
  );
}
