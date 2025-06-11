import PolemonList from "@/components/PolemonList";
import { fetchPokemonList, fetchPokemonById } from "@/lib/pokeapi";
import type { PokemonBasic } from "@/interfaces/pokemon";

// Função para extrair o id da URL
function getIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : 0;
}

export default async function Home() {
  const pokemonBasics = await fetchPokemonList();

  const pokemons = await Promise.all(
    pokemonBasics.map(async (basic: PokemonBasic) => {
      const id = getIdFromUrl(basic.url);
      return await fetchPokemonById(id);
    })
  );

  return (
    <main className="min-h-screen">
      <PolemonList pokemons={pokemons} />
    </main>
  );
}
