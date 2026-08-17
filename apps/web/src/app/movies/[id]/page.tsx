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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-primary">Movie not found</h1>
        <Link href="/movies" className="text-primary hover:underline mt-4 inline-block">Back to Movies</Link>
      </div>
    );
  }

  // Find showtimes for this movie
  const movieShowtimes = allShowtimes
    .filter(st => st.movieId === movie.id)
    .sort((a, b) => new Date(a.showTimeStart).getTime() - new Date(b.showTimeStart).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
      <Link href="/movies" className="text-muted-foreground hover:text-primary transition-colors mb-6 inline-block text-sm">
        &larr; Back to Movies
      </Link>
      
      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div>
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-xl shadow-lg shadow-black/50 border border-border"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-card rounded-xl flex items-center justify-center border border-border">
              <span className="text-muted-foreground">No Poster</span>
            </div>
          )}
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">{movie.title}</h1>
          <p className="text-muted-foreground mb-6">{movie.duration} minutes</p>
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{movie.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Available Showtimes</h2>
            {movieShowtimes.length === 0 ? (
              <p className="text-muted-foreground">No showtimes available for this movie.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {movieShowtimes.map(showtime => {
                  const startTime = new Date(showtime.showTimeStart);
                  return (
                    <div key={showtime.id} className="border border-border rounded-xl p-4 bg-card hover:border-primary/40 transition-colors">
                      <div className="font-semibold text-lg mb-1 text-foreground">
                        {startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-primary font-bold mb-3">
                        {startTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <div className="text-muted-foreground text-sm mb-4">
                        Price: {showtime.basePrice} {showtime.baseCurrency || "USD"}
                      </div>
                      <Link href={`/showtimes/${showtime.id}/seats`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer">Select Seats</Button>
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
