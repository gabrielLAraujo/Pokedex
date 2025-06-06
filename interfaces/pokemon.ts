export interface PokemonBasic {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBasic[];
}

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonSprite {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string;
    };
  };
}
export interface PokemonDetail {
  id: number;
  name: string;
  sprites: PokemonSprite;
  types: PokemonType[];
}