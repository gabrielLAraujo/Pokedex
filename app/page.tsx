import PokemonCard from "@/components/PokemonCard";
import PolemonList from "@/components/PolemonList";
import { fetchPokemonList } from "@/lib/pokeapi";
import Image from "next/image";

export default async function Home() {
  const pokemons = await fetchPokemonList();
  return (
    <PolemonList pokemons={pokemons} />
  );
}
