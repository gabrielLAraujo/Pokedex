"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { getTypeColor } from "@/lib/utils";

function getIdFromUrl(url: string) {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? match[1] : "";
}

export default function PokemonCard({
    pokemonDetail,
    largeImage = false,
}: {
    pokemonDetail: any;
    largeImage?: boolean;
}) {
    // fallback para tipos e id se não vierem completos
    const id = pokemonDetail.id || getIdFromUrl(pokemonDetail.url);
    const name = pokemonDetail.name;
    const types = pokemonDetail.types?.map((t: any) => t.type.name) || ["normal"];
    const gradientBg =
        types.length > 1
            ? `bg-gradient-to-br from-[var(--${types[0]})] to-[var(--${types[1]})]`
            : getTypeColor(types[0], true);

    const handleClick = () => {
        window.location.href = `/pokemon/${id}`;
    };

    return (
        <Card
            onClick={handleClick}
            className={`relative rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${gradientBg} bg-blend-multiply cursor-pointer`}
        >
            <CardHeader>
                <div className="flex flex-col items-center">
                    <CardTitle className="text-center text-2xl font-extrabold text-gray-800 dark:text-gray-100 tracking-wide drop-shadow-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </CardTitle>
                    <CardDescription>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5 mt-1 shadow-sm">
                            #{id}
                        </span>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-3">
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                        alt={name}
                        className={`${largeImage ? "w-40 h-40" : "w-28 h-28"} drop-shadow-lg bg-white/80 dark:bg-gray-700/80 rounded-full p-2 border-4 border-blue-100 dark:border-gray-800 transition-all`}
                        loading="lazy"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

