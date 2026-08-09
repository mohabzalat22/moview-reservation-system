export interface Movie {
  id: string;
  name: string;
  title: string;
  description: string;
  poster: string;
}
export interface createMovie {
  name: string;
  title: string;
  description: string;
  poster: string;
}

export interface updateMovie {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  poster?: string;
}
