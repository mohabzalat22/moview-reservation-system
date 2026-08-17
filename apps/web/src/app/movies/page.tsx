import { getMovies } from "@/services/movies.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-2 text-foreground">Now Playing</h1>
      <p className="text-muted-foreground mb-8">Browse all available movies and book your seats.</p>
      {movies.length === 0 ? (
        <p className="text-muted-foreground">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-card rounded-xl border border-border overflow-hidden flex flex-col hover:border-primary/30 hover:scale-[1.03] transition-all duration-300 group"
            >
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-[400px] object-cover group-hover:brightness-110 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No Poster</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold mb-2 text-foreground line-clamp-1">{movie.title}</h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                  {movie.description}
                </p>
                <Link href={`/movies/${movie.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer">
                    View Movie
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
