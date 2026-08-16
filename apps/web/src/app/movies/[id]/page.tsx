import { getMovies } from "@/services/movies.service";
import { getShowTimes } from "@/services/showtimes.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function MovieDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [movies, allShowtimes] = await Promise.all([
    getMovies(),
    getShowTimes()
  ]);

  const movie = movies.find(m => m.id === params.id);
  
  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Movie not found</h1>
        <Link href="/movies" className="text-blue-500 hover:underline mt-4 inline-block">Back to Movies</Link>
      </div>
    );
  }

  // Find showtimes for this movie
  const movieShowtimes = allShowtimes
    .filter(st => st.movieId === movie.id)
    .sort((a, b) => new Date(a.showTimeStart).getTime() - new Date(b.showTimeStart).getTime());

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
      <Link href="/movies" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to Movies
      </Link>
      
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Poster</span>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
          <p className="text-gray-500 mb-6">{movie.duration} minutes</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{movie.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Showtimes</h2>
            {movieShowtimes.length === 0 ? (
              <p className="text-gray-500">No showtimes available for this movie.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movieShowtimes.map(showtime => {
                  const startTime = new Date(showtime.showTimeStart);
                  return (
                    <div key={showtime.id} className="border rounded-lg p-4 bg-white shadow-sm hover:border-red-500 transition-colors">
                      <div className="font-semibold text-lg mb-1">
                        {startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-red-600 font-bold mb-3">
                        {startTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <div className="text-gray-600 text-sm mb-4">
                        Price: {showtime.basePrice} {showtime.baseCurrency || "USD"}
                      </div>
                      <Link href={`/showtimes/${showtime.id}/seats`}>
                        <Button className="w-full" variant="outline">Select Seats</Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
