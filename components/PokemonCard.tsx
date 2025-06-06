import { PokemonBasic } from "@/interfaces/pokemon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { fetchPokemonByName } from "@/lib/pokeapi";

export default async function PokemonCard({ pokemon }: { pokemon: PokemonBasic }) {
    console.log(pokemon);
    const pokemonDetail = await fetchPokemonByName(pokemon.name)
       
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </CardTitle>
        <CardDescription>
            <span className="text-sm text-gray-500">#{pokemonDetail.id}</span>
        </CardDescription>
        <CardContent>
            <div className="flex justify-center">
                <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetail.id}.png`}
                alt={pokemon.name}
                className="w-24 h-24"
                />
            </div>
            <p className="text-center text-sm text-gray-500">
                {pokemon.name} is a Pokémon from the PokeAPI.
            </p>
        </CardContent>
      </CardHeader>
    </Card>
  );
}