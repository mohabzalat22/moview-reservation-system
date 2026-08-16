export interface Genre {
  id: string;
  name: string;
}

export interface CreateGenre {
  name: string;
}

export interface UpdateGenre {
  name?: string;
}
