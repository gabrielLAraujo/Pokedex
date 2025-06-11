import { PokemonBasic, PokemonDetail, PokemonListResponse } from "@/interfaces/pokemon";

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 151, offset = 0): Promise<PokemonBasic[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Falha ao buscar lista de Pokémons');
  const data: PokemonListResponse = await res.json();
  return data.results;
}

export async function fetchPokemonById(id: number): Promise<PokemonDetail> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Pokémon ${id} não encontrado`);
  return (await res.json()) as PokemonDetail;
}
