export interface PokemonBasic {
  id: number;
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

export interface PokemonStat {
  stat: { name: string; url: string };
  base_stat: number;
}

export interface PokemonAbility {
  ability: { name: string; url: string };
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: PokemonSprite;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
  height: number;
  weight: number;
}

export type Pokemon = {
  id: number;
  name: string;
  types: PokemonType[];
  stats?: PokemonStat[];
  abilities?: PokemonAbility[];
  sprites?: PokemonSprite;
  url?: string;
};