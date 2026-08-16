import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ShowTimesSection } from "@/components/showtimes-section"

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 text-center pb-16">
      <div className="mt-16 mb-16">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Welcome to <span className="text-red-600">Retro</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 mx-auto">
          Experience cinema like never before. Book your tickets for the latest blockbusters with our sleek, Netflix-inspired reservation system.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className={buttonVariants({ size: "lg", className: "bg-red-600 hover:bg-red-700" })}>
            Get Started
          </Link>
          <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Sign In
          </Link>
        </div>
      </div>

      <ShowTimesSection />
    </div>
  )
}
