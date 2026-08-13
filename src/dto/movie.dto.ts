export interface Movie {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
}
export interface createMovie {
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
}

export interface updateMovie {
  name?: string;
  title?: string;
  description?: string;
  duration: number;
  poster: string | null;
}
