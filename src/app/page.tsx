import Link from "next/link";

const mockUrls = [
  "https://utfs.io/f/369adc9d-e57e-4871-a8ac-771e3612431b-ttk1f7.png",
  "https://utfs.io/f/ae81c410-ce20-4d32-a5b9-fc12ccd151bb-xycc3p.png",
  "https://utfs.io/f/4f83cdc6-deb9-4c82-b298-61a690277fd8-k9asoe.png",
]

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-wrap">
        {mockImages.map((image) => (
          <div key={image.id} className='w-48'>
            <img src={image.url} alt="image"/>
          </div>
        ))}
      </div>
    </main>
  );
}
