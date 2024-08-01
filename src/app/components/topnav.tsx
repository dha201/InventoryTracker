'use client';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

export function TopNav() {
  const router = useRouter();

  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <SignedIn>
        <div className="flex space-x-4">
          <button onClick={() => router.push('/')} className="hover:text-gray-300">Scan Items</button>
          {/* <button onClick={() => router.push('/history')} className="hover:text-gray-300">History</button>
          <button onClick={() => router.push('/inventory')} className="hover:text-gray-300">Current Inventory</button> */}
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex-grow"></div>
      </SignedOut>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}
