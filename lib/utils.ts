import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função utilitária para colorir tipos de Pokémon
export function getTypeColor(type: string, background = false) {
    const colors: Record<string, string> = {
        fire: background ? "bg-orange-400/80 dark:bg-orange-600/80" : "bg-orange-500",
        water: background ? "bg-blue-300/80 dark:bg-blue-700/80" : "bg-blue-500",
        grass: background ? "bg-green-300/80 dark:bg-green-700/80" : "bg-green-500",
        electric: background ? "bg-yellow-200/80 dark:bg-yellow-400/80" : "bg-yellow-400 text-yellow-900",
        psychic: background ? "bg-pink-300/80 dark:bg-pink-700/80" : "bg-pink-500",
        ice: background ? "bg-cyan-200/80 dark:bg-cyan-600/80" : "bg-cyan-400 text-cyan-900",
        dragon: background ? "bg-indigo-300/80 dark:bg-indigo-700/80" : "bg-indigo-600",
        dark: background ? "bg-gray-800/80" : "bg-gray-800",
        fairy: background ? "bg-pink-200/80 dark:bg-pink-400/80" : "bg-pink-300 text-pink-900",
        normal: background ? "bg-gray-200/80 dark:bg-gray-400/80" : "bg-gray-400 text-gray-900",
        fighting: background ? "bg-red-300/80 dark:bg-red-700/80" : "bg-red-700",
        flying: background ? "bg-sky-200/80 dark:bg-sky-600/80" : "bg-sky-400 text-sky-900",
        poison: background ? "bg-purple-300/80 dark:bg-purple-700/80" : "bg-purple-500",
        ground: background ? "bg-yellow-300/80 dark:bg-yellow-700/80" : "bg-yellow-700",
        rock: background ? "bg-yellow-400/80 dark:bg-yellow-800/80" : "bg-yellow-800",
        bug: background ? "bg-lime-200/80 dark:bg-lime-600/80" : "bg-lime-600",
        ghost: background ? "bg-violet-300/80 dark:bg-violet-700/80" : "bg-violet-700",
        steel: background ? "bg-gray-300/80 dark:bg-gray-500/80" : "bg-gray-500 text-gray-900",
    };
    return colors[type] || (background ? "bg-gray-100/80 dark:bg-gray-700/80" : "bg-gray-300 text-gray-900");
}