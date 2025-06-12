"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchPokemonDetail, getApiStatus, PokemonDetail } from '@/lib/pokeapi';
import Image from 'next/image';

// Função utilitária para capitalizar texto
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Função para obter cores dos tipos
function getTypeColor(type: string): string {
  const colors: { [key: string]: string } = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-300',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-green-400',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  return colors[type] || 'bg-gray-400';
}

// Função de fallback local para gerar dados de demonstração
function createFallbackPokemon(id: number): PokemonDetail {
  const pokemonNames: { [key: number]: string } = {
    1: 'bulbasaur', 2: 'ivysaur', 3: 'venusaur', 4: 'charmander', 5: 'charmeleon',
    6: 'charizard', 7: 'squirtle', 8: 'wartortle', 9: 'blastoise', 10: 'caterpie',
    25: 'pikachu', 26: 'raichu', 39: 'jigglypuff', 104: 'cubone', 143: 'snorlax'
  };

  const name = pokemonNames[id] || `pokemon-${id}`;

  return {
    id,
    name,
    height: Math.floor(Math.random() * 20) + 5,
    weight: Math.floor(Math.random() * 100) + 10,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      other: {
        'official-artwork': {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        }
      }
    },
    types: [
      {
        slot: 1,
        type: { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' }
      }
    ],
    stats: [
      { base_stat: 45, effort: 0, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } },
      { base_stat: 49, effort: 0, stat: { name: 'attack', url: 'https://pokeapi.co/api/v2/stat/2/' } },
      { base_stat: 49, effort: 0, stat: { name: 'defense', url: 'https://pokeapi.co/api/v2/stat/3/' } },
      { base_stat: 65, effort: 1, stat: { name: 'special-attack', url: 'https://pokeapi.co/api/v2/stat/4/' } },
      { base_stat: 65, effort: 0, stat: { name: 'special-defense', url: 'https://pokeapi.co/api/v2/stat/5/' } },
      { base_stat: 45, effort: 0, stat: { name: 'speed', url: 'https://pokeapi.co/api/v2/stat/6/' } }
    ],
    abilities: [
      {
        ability: { name: 'overgrow', url: 'https://pokeapi.co/api/v2/ability/65/' },
        is_hidden: false,
        slot: 1
      }
    ]
  };
}

export default function PokemonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const pokemonId = parseInt(params.id as string);

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  const loadPokemonDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🚀 Carregando detalhes do pokémon #${pokemonId}...`);
      
      const data = await fetchPokemonDetail(pokemonId);
      setPokemon(data);
      setUsingFallback(false);
      
      // Atualiza status da API
      setApiStatus(getApiStatus());
      
      console.log(`✅ Detalhes do pokémon #${pokemonId} carregados com sucesso`);
      
    } catch (error: any) {
      console.error(`❌ Erro ao carregar detalhes do pokémon #${pokemonId}:`, error.message);
      
      // Determina se deve usar fallback baseado no tipo de erro
      const shouldUseFallback = 
        error.message.includes('SSL') ||
        error.message.includes('certificado') ||
        error.message.includes('403') ||
        error.message.includes('conectividade') ||
        error.message.includes('fallback');
      
      if (shouldUseFallback) {
        console.log(`📦 Usando dados de demonstração para pokémon #${pokemonId}...`);
        const fallbackData = createFallbackPokemon(pokemonId);
        setPokemon(fallbackData);
        setUsingFallback(true);
        setError(null);
      } else {
        setError(error.message);
        setUsingFallback(false);
      }
      
      setApiStatus(getApiStatus());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pokemonId) {
      loadPokemonDetail();
    }
  }, [pokemonId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Carregando Pokémon...</h2>
          <p className="text-gray-500 mt-2">Buscando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error && !usingFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Erro ao Carregar</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={loadPokemonDetail}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors mr-2"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Pokémon não encontrado</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Voltar à Pokédex
          </button>
        </div>

        {/* Status da API */}
        {usingFallback && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Modo de Demonstração:</strong> Exibindo dados locais para este Pokémon.
                </p>
                <button
                  onClick={loadPokemonDetail}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Tentar conectar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card principal do pokémon */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-4xl font-bold text-gray-800 mb-2">
              {capitalize(pokemon.name)}
            </CardTitle>
            <CardDescription>
              <span className="text-lg font-semibold text-gray-600 bg-gray-100 rounded-full px-4 py-1">
                #{pokemon.id.toString().padStart(3, '0')}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-8">
            {/* Imagem do pokémon */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-6 shadow-inner">
                <Image
                  src={pokemon.sprites.other?.['official-artwork']?.front_default || 
                        pokemon.sprites.front_default || 
                        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
                  alt={pokemon.name}
                  width={300}
                  height={300}
                  className="mx-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Informações do pokémon */}
            <div className="space-y-6">
              {/* Tipos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Tipos</h3>
                <div className="flex gap-2">
                  {pokemon.types.map((type) => (
                    <span
                      key={type.type.name}
                      className={`px-3 py-1 rounded-full text-white font-medium text-sm ${getTypeColor(type.type.name)}`}
                    >
                      {capitalize(type.type.name)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Características físicas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Altura</h3>
                  <p className="text-2xl font-bold text-blue-600">{pokemon.height / 10} m</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Peso</h3>
                  <p className="text-2xl font-bold text-blue-600">{pokemon.weight / 10} kg</p>
                </div>
              </div>

              {/* Habilidades */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Habilidades</h3>
                <div className="space-y-1">
                  {pokemon.abilities.map((ability) => (
                    <div key={ability.ability.name} className="flex items-center gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {capitalize(ability.ability.name.replace('-', ' '))}
                      </span>
                      {ability.is_hidden && (
                        <span className="text-xs text-purple-600 font-medium">(Oculta)</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Estatísticas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Estatísticas Base</h3>
                <div className="space-y-3">
                  {pokemon.stats.map((stat) => {
                    const statNames: { [key: string]: string } = {
                      hp: 'HP',
                      attack: 'Ataque',
                      defense: 'Defesa',
                      'special-attack': 'Ataque Especial',
                      'special-defense': 'Defesa Especial',
                      speed: 'Velocidade',
                    };
                    
                    const maxStat = 255; // Valor máximo teórico para stats
                    const percentage = (stat.base_stat / maxStat) * 100;
                    
                    return (
                      <div key={stat.stat.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">
                            {statNames[stat.stat.name] || capitalize(stat.stat.name)}
                          </span>
                          <span className="font-bold text-blue-600">{stat.base_stat}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer com informações da fonte */}
        {apiStatus && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p>
              Fonte: {usingFallback ? 'Dados Locais' : apiStatus.currentUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}