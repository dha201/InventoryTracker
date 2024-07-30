import Link from "next/link";
import { db } from "~/server/db";

// Make sure to change TS version to match with workspace instead of vscode

// Convert page to a dynamic page, making sure that everytime something changes in the database, the page is revalidated
export const dynamic = "force-dynamic";

const mockUrls = [
  "https://utfs.io/f/369adc9d-e57e-4871-a8ac-771e3612431b-ttk1f7.png",
  "https://utfs.io/f/ae81c410-ce20-4d32-a5b9-fc12ccd151bb-xycc3p.png",
  "https://utfs.io/f/4f83cdc6-deb9-4c82-b298-61a690277fd8-k9asoe.png",
]

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {

  const posts = await db.query.posts.findMany();

  console.log(posts);

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {posts.map((post) => (
          <div key={post.id}>
            {post.name}
          </div>
        ))}
        {mockImages.map((image) => (
          <div key={image.id} className='w-48'>
            <img src={image.url} alt="image"/>
          </div>
        ))}
      </div>
    </main>
  );
}
