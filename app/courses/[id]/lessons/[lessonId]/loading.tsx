export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col lg:flex-row">
      <main className="flex-1 bg-white">
        <div className="bg-black aspect-video max-w-5xl mx-auto animate-pulse" />
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="h-4 w-16 rounded bg-[#e8e8e8] animate-pulse mb-2" />
          <div className="h-7 w-2/3 rounded bg-[#d1d7dc] animate-pulse" />
        </div>
      </main>
      <aside className="hidden lg:block w-72 border-l border-[#d1d7dc]">
        <div className="border-b border-[#d1d7dc] px-4 py-3">
          <div className="h-4 w-24 rounded bg-[#d1d7dc] animate-pulse" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-[#d1d7dc]">
            <div className="h-4 w-4 rounded bg-[#e8e8e8] animate-pulse" />
            <div className="h-3 flex-1 rounded bg-[#e8e8e8] animate-pulse" />
          </div>
        ))}
      </aside>
    </div>
  )
}
