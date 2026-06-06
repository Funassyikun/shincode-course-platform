export default function Loading() {
  return (
    <>
      <div className="bg-[#1c1d1f]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="h-4 w-20 rounded bg-white/20 animate-pulse mb-3" />
          <div className="h-8 w-2/3 rounded bg-white/20 animate-pulse mb-3" />
          <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1">
            <div className="h-6 w-40 rounded bg-[#d1d7dc] animate-pulse mb-4" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#d1d7dc] bg-white">
                <div className="h-5 w-5 rounded-full bg-[#d1d7dc] animate-pulse" />
                <div className="h-4 flex-1 rounded bg-[#e8e8e8] animate-pulse" />
              </div>
            ))}
          </div>
          <div className="w-full lg:w-80">
            <div className="aspect-video w-full rounded-t-lg bg-[#d1d7dc] animate-pulse" />
            <div className="border border-t-0 border-[#d1d7dc] p-4 rounded-b-lg">
              <div className="h-6 w-16 rounded bg-[#d1d7dc] animate-pulse mb-2" />
              <div className="h-4 w-28 rounded bg-[#e8e8e8] animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
