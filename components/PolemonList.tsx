"use client";
import { useState } from "react";
import { Pokemon } from "@/interfaces/pokemon";
import PokemonCard from "./PokemonCard";

const CARDS_PER_PAGE = 20;

export default function PolemonList({ pokemons }: { pokemons: Pokemon[] }) {
    const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + CARDS_PER_PAGE);
    };

    return (
        <section className="relative w-full min-h-screen px-4 py-10 bg-gradient-to-br from-yellow-100 via-blue-100 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors overflow-x-hidden">
            <div className="relative z-10 flex flex-col items-center mb-8">
                <h1 className="text-5xl font-extrabold text-center text-red-600 dark:text-yellow-300 drop-shadow-lg tracking-wide font-pokemon">
                    Pokédex
                </h1>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-200 max-w-2xl text-center font-medium">
                    Explore todos os Pokémon! Clique em um card para ver detalhes. Use o tema escuro para uma experiência ainda melhor.
                </p>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full">
                {pokemons.slice(0, visibleCount).map((pokemon, idx) => (
                    <PokemonCard
                        key={pokemon.name}
                        pokemonDetail={{
                            ...pokemon,
                            id: pokemon.id ?? idx + 1
                        }}
                        largeImage
                    />
                ))}
            </div>
            {visibleCount < pokemons.length && (
                <div className="relative z-10 flex justify-center mt-10">
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 via-red-400 to-blue-400 dark:from-yellow-600 dark:via-red-600 dark:to-blue-700 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
                    >
                        Carregar mais
                    </button>
                </div>
            )}
        </section>
    );
}