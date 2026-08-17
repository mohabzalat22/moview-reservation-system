import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ShowTimesSection } from "@/components/showtimes-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#141414] w-full text-white pb-16">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col justify-center px-4 md:px-16 overflow-hidden">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Cinema Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-[#141414]/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl text-white">
            Unlimited <span className="text-red-600">movies</span>, TV shows, and more.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mb-8 drop-shadow-md">
            Experience cinema like never before. Book your tickets for the latest blockbusters with our sleek reservation system.
          </p>
          <div className="flex gap-4">
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className: "bg-red-600 hover:bg-red-700 text-white font-semibold text-lg px-8",
              })}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "bg-black/40 text-white border-gray-400 hover:bg-gray-800 hover:text-white font-semibold text-lg px-8 backdrop-blur-sm",
              })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-16 px-4 md:px-16">
        <ShowTimesSection />
      </div>
    </div>
  )
}
