export interface Movie {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
  genres?: { id: string; name: string }[];
}
export interface CreateMovie {
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
  genreIds?: string[];
}

export interface UpdateMovie {
  name?: string;
  title?: string;
  description?: string;
  duration?: number;
  poster?: string | null;
  genreIds?: string[];
}
