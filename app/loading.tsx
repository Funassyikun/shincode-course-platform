export default function Loading() {
  return (
    <>
      <div className="bg-[#1c1d1f]">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="h-4 w-24 rounded bg-white/20 animate-pulse mb-3" />
          <div className="h-9 w-72 rounded bg-white/20 animate-pulse mb-3" />
          <div className="h-4 w-96 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 h-6 w-40 rounded bg-[#d1d7dc] animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-video w-full bg-[#f7f9fa] animate-pulse" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 w-full rounded bg-[#d1d7dc] animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-[#e8e8e8] animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-[#e8e8e8] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
