"use client";
import { signIn, signOut, useSession } from "next-auth/react";
export function Appbar() {
  const session = useSession();

  return (
    <div>
      <div className="flex justify-between">
        <div>Vol2</div>
        <div>
          {session.data?.user && (
            <div>
              <p className="text-center">{session.data?.user?.name}</p>
              <button
                className="m-2 p-2 bg-amber-300"
                onClick={() => signOut()}
              >
                SignOut
              </button>
            </div>
          )}
          {!session.data?.user && (
            <div>
              <button className="m-2 p-2 bg-amber-300" onClick={() => signIn()}>
                SignIn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
