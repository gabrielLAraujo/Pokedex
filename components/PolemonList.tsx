"use client";
import { useState } from "react";
import { PokemonBasic } from "@/interfaces/pokemon";
import PokemonCard from "./PokemonCard";
import Image from "next/image";

const CARDS_PER_PAGE = 10;

export default function PolemonList({ pokemons }: { pokemons: PokemonBasic[] }) {
    const [visibleCount, setVisibleCount] = useState(CARDS_PER_PAGE);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + CARDS_PER_PAGE);
    };

    return (
        <section className="relative w-screen min-h-screen px-0 py-10 bg-gradient-to-br from-yellow-100 via-blue-100 to-red-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors overflow-x-hidden">
            {/* <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-10 z-0">
                <Image
                    src="/pokeball-bg.png"
                    alt="Pokeball background"
                    width={800}
                    height={800}
                    className="hidden md:block"
                    priority
                />
            </div> */}
            <div className="relative z-10 flex flex-col items-center mb-8">
                {/* <Image
                    src="/pokemon-logo.png"
                    alt="Pokédex Logo"
                    width={320}
                    height={120}
                    className="mb-4 drop-shadow-lg"
                    priority
                /> */}
                <h1 className="text-5xl font-extrabold text-center text-red-600 dark:text-yellow-300 drop-shadow-lg tracking-wide font-pokemon">
                    Pokédex
                </h1>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-200 max-w-2xl text-center font-medium">
                    Explore todos os Pokémon! Clique em um card para ver detalhes. Use o tema escuro para uma experiência ainda melhor.
                </p>
            </div>
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full px-4">
                {pokemons.slice(0, visibleCount).map((pokemon) => (
                    <PokemonCard key={pokemon.name} pokemonDetail={pokemon} largeImage />
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