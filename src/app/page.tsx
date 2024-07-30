import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "~/server/db";

// Make sure to change TS version to match with workspace instead of vscode

// Convert page to a dynamic page, making sure that everytime something changes in the database, the page is revalidated
export const dynamic = "force-dynamic";

async function Images() {
  // const images = await db.query.images.findMany();
  // flip the images order in reverser order:
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return(
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className='flex flex-col w-48'>
          <img src={image.url} alt="image"/>
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedOut>
          <div className="h-full w-full text-2xl text-center">Please sign in above</div>
      </SignedOut>
      <SignedIn>
          <Images />
      </SignedIn>
    </main>
  );
}
