import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ShowTimesSection } from "@/components/showtimes-section"

export default function Home() {
  return (
    <div className="flex flex-col w-full text-foreground pb-16">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image & Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Cinema Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl text-white">
              Unlimited <span className="text-primary">movies</span>, TV shows, and more.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 drop-shadow-md">
              Experience cinema like never before. Book your tickets for the latest blockbusters with our sleek reservation system.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-8 shadow-lg shadow-primary/20",
                })}
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white font-semibold text-lg px-8 backdrop-blur-sm",
                })}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <ShowTimesSection />
      </div>
    </div>
  )
}
