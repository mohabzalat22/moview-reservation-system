import { getMovies } from "@/services/movies.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  const movies = await getMovies();

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <h1 className="text-4xl font-bold mb-8">Now Playing</h1>
      {movies.length === 0 ? (
        <p className="text-gray-500">No movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Poster</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold mb-2 line-clamp-1">{movie.title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                  {movie.description}
                </p>
                <Link href={`/movies/${movie.id}`}>
                  <Button className="w-full bg-red-600 hover:bg-red-700">View Movie</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
