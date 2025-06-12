import { PokemonBasic, PokemonDetail } from "@/interfaces/pokemon";

// Dados de fallback para demonstração quando a API não está disponível
export const fallbackPokemonList: PokemonBasic[] = [
  { id: 1, name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { id: 2, name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { id: 3, name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
  { id: 4, name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
  { id: 5, name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
  { id: 6, name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
  { id: 7, name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
  { id: 8, name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
  { id: 9, name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
  { id: 10, name: "caterpie", url: "https://pokeapi.co/api/v2/pokemon/10/" },
  { id: 11, name: "metapod", url: "https://pokeapi.co/api/v2/pokemon/11/" },
  { id: 12, name: "butterfree", url: "https://pokeapi.co/api/v2/pokemon/12/" },
  { id: 13, name: "weedle", url: "https://pokeapi.co/api/v2/pokemon/13/" },
  { id: 14, name: "kakuna", url: "https://pokeapi.co/api/v2/pokemon/14/" },
  { id: 15, name: "beedrill", url: "https://pokeapi.co/api/v2/pokemon/15/" },
  { id: 16, name: "pidgey", url: "https://pokeapi.co/api/v2/pokemon/16/" },
  { id: 17, name: "pidgeotto", url: "https://pokeapi.co/api/v2/pokemon/17/" },
  { id: 18, name: "pidgeot", url: "https://pokeapi.co/api/v2/pokemon/18/" },
  { id: 19, name: "rattata", url: "https://pokeapi.co/api/v2/pokemon/19/" },
  { id: 20, name: "raticate", url: "https://pokeapi.co/api/v2/pokemon/20/" },
  { id: 25, name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
  { id: 26, name: "raichu", url: "https://pokeapi.co/api/v2/pokemon/26/" },
  { id: 39, name: "jigglypuff", url: "https://pokeapi.co/api/v2/pokemon/39/" },
  { id: 104, name: "cubone", url: "https://pokeapi.co/api/v2/pokemon/104/" },
  { id: 143, name: "snorlax", url: "https://pokeapi.co/api/v2/pokemon/143/" },
];

export function getFallbackPokemonDetail(id: number): PokemonDetail {
  const pokemon = fallbackPokemonList.find(p => p.id === id);
  
  if (!pokemon) {
    throw new Error(`Pokémon com ID ${id} não encontrado nos dados de fallback`);
  }

  // Dados básicos para demonstração
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
      other: {
        'official-artwork': {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
        }
      }
    },
    types: getTypesByPokemonId(pokemon.id),
    stats: getStatsByPokemonId(pokemon.id),
    abilities: getAbilitiesByPokemonId(pokemon.id),
    height: Math.floor(Math.random() * 20) + 5, // Altura aleatória para demonstração
    weight: Math.floor(Math.random() * 100) + 10, // Peso aleatório para demonstração
  };
}

function getTypesByPokemonId(id: number) {
  // Tipos simplificados baseados no ID para demonstração
  const typeMap: Record<number, string[]> = {
    1: ['grass', 'poison'], // Bulbasaur
    2: ['grass', 'poison'], // Ivysaur
    3: ['grass', 'poison'], // Venusaur
    4: ['fire'],            // Charmander
    5: ['fire'],            // Charmeleon
    6: ['fire', 'flying'],  // Charizard
    7: ['water'],           // Squirtle
    8: ['water'],           // Wartortle
    9: ['water'],           // Blastoise
    25: ['electric'],       // Pikachu
    26: ['electric'],       // Raichu
    39: ['normal', 'fairy'], // Jigglypuff
    104: ['ground'],        // Cubone
    143: ['normal'],        // Snorlax
  };

  const types = typeMap[id] || ['normal'];
  return types.map((type, index) => ({
    slot: index + 1,
    type: { name: type, url: `https://pokeapi.co/api/v2/type/${type}/` }
  }));
}

function getStatsByPokemonId(id: number) {
  // Stats aleatórios para demonstração
  return [
    { stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
    { stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
    { stat: { name: 'defense', url: 'https://pokeapi.co/api/v2/stat/3/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
    { stat: { name: 'special-attack', url: 'https://pokeapi.co/api/v2/stat/4/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
    { stat: { name: 'special-defense', url: 'https://pokeapi.co/api/v2/stat/5/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
    { stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' }, base_stat: Math.floor(Math.random() * 100) + 20 },
  ];
}

function getAbilitiesByPokemonId(id: number) {
  // Habilidades simplificadas para demonstração
  const abilityMap: Record<number, string[]> = {
    1: ['overgrow'],
    4: ['blaze'],
    7: ['torrent'],
    25: ['static'],
    143: ['immunity', 'thick-fat']
  };

  const abilities = abilityMap[id] || ['run-away'];
  return abilities.map(ability => ({
    ability: { name: ability, url: `https://pokeapi.co/api/v2/ability/${ability}/` }
  }));
} 