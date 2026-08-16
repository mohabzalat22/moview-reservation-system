export interface Movie {
  id: string;
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
}
export interface CreateMovie {
  name: string;
  title: string;
  description: string;
  duration: number;
  poster: string | null;
}

export interface UpdateMovie {
  name?: string;
  title?: string;
  description?: string;
  duration: number;
  poster: string | null;
}
