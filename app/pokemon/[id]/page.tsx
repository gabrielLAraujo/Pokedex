import { fetchPokemonById } from "@/lib/pokeapi";
import { getTypeColor } from "@/lib/utils";
import Image from "next/image";

export default async function PokemonPage({ params }: { params: { id: string } }) {
    const pokemon = await fetchPokemonById(Number(params.id));

    if (!pokemon) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-3xl font-bold text-red-600">Pokémon não encontrado!</h2>
            </div>
        );
    }

    const types = pokemon.types?.map((t: any) => t.type.name) || ["normal"];
    const gradientBg =
        types.length > 1
            ? `bg-gradient-to-br from-[var(--${types[0]})] to-[var(--${types[1]})]`
            : getTypeColor(types[0], true);

    return (
        <main className={`min-h-screen flex flex-col items-center justify-center px-4 py-10 ${gradientBg}`}>
            <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl p-8 max-w-xl w-full flex flex-col items-center">
                <h1 className="text-4xl font-extrabold mb-2 text-gray-800 dark:text-gray-100 capitalize">
                    {pokemon.name}
                </h1>
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
                    #{pokemon.id}
                </span>
                <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                    alt={pokemon.name}
                    width={256}
                    height={256}
                    className="mb-4 drop-shadow-lg bg-white rounded-full"
                />
                <div className="flex gap-3 mb-4">
                    {pokemon.types.map((typeObj: any) => (
                        <span
                            key={typeObj.type.name}
                            className={`px-3 py-1 rounded-full text-sm font-bold capitalize text-white shadow ${getTypeColor(typeObj.type.name)}`}
                        >
                            {typeObj.type.name}
                        </span>
                    ))}
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Base Stats</h2>
                    <ul>
                        {/* {pokemon.stats.map((stat: any) => (
                            <li key={stat.stat.name} className="flex justify-between mb-1 text-gray-700 dark:text-gray-200">
                                <span className="capitalize">{stat.stat.name.replace("-", " ")}:</span>
                                <span className="font-semibold">{stat.base_stat}</span>
                            </li>
                        ))} */}
                    </ul>
                </div>
                <div className="w-full mt-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Abilities</h2>
                    <ul className="flex flex-wrap gap-2">
                        {/* {pokemon.abilities.map((a: any) => (
                            <li key={a.ability.name} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                                {a.ability.name}
                            </li>
                        ))} */}
                    </ul>
                </div>
            </div>
        </main>
    );
}