import Image from 'next/image'
import Link from 'next/link'

type Course = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col border border-transparent hover:border-[#d1d7dc] hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#f7f9fa]">
        {course.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#ede9fe]">
            <span className="text-3xl">🎬</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-bold leading-snug text-[#1c1d1f] line-clamp-2 group-hover:text-[#a435f0] transition-colors">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-[#6a6f73] line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1">
          <span className="text-xs font-bold text-[#b4690e]">★★★★★</span>
          <span className="text-xs font-bold text-[#6a6f73]">(4.8)</span>
        </div>
        <p className="mt-1 text-sm font-extrabold text-[#1c1d1f]">無料</p>
      </div>
    </Link>
  )
}
