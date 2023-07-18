export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Session {
  estaLogeado: boolean;
  currentURL: string;
  token: string | null;
}
