"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPokemonList, getApiStatus, PokemonListResponse } from "@/lib/pokeapi";
import { fallbackPokemonList } from "@/lib/fallback-data";
import Image from "next/image";

// Componente PokemonCard simples para a listagem
function SimplePokemonCard({ pokemon, pokemonId }: {
  pokemon: { name: string; url: string };
  pokemonId: number;
}) {
  const handleClick = () => {
    window.location.href = `/pokemon/${pokemonId}`;
  };

  return (
    <Card
      onClick={handleClick}
      className="relative rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-gradient-to-br from-blue-50 to-indigo-100 cursor-pointer"
    >
      <CardHeader>
        <div className="flex flex-col items-center">
          <CardTitle className="text-center text-xl font-bold text-gray-800 tracking-wide group-hover:text-blue-600 transition-colors">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </CardTitle>
          <CardDescription>
            <span className="text-xs font-semibold text-gray-600 bg-gray-100 rounded px-2 py-0.5 mt-1">
              #{pokemonId.toString().padStart(3, '0')}
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-3">
          <Image
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`}
            alt={pokemon.name}
            width={112}
            height={112}
            className="drop-shadow-lg bg-white/80 rounded-full p-2 border-4 border-blue-100 transition-all"
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonListResponse['results']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);

  const loadPokemons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Iniciando carregamento de pokémons...');
      
      const data = await fetchPokemonList(151, 0);
      setPokemonList(data.results);
      setUsingFallback(false);
      
      // Atualiza status da API
      setApiStatus(getApiStatus());
      
      console.log('✅ Pokémons carregados com sucesso da PokeAPI');
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar pokémons:', error.message);
      
      // Determina se deve usar fallback baseado no tipo de erro
      const shouldUseFallback = 
        error.message.includes('SSL') ||
        error.message.includes('certificado') ||
        error.message.includes('403') ||
        error.message.includes('conectividade') ||
        error.message.includes('fallback');
      
      if (shouldUseFallback) {
        console.log('📦 Usando dados de demonstração...');
        setPokemonList(fallbackPokemonList);
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
    loadPokemons();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Carregando Pokédex...</h2>
          <p className="text-gray-500 mt-2">Conectando com a PokeAPI...</p>
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
          <button
            onClick={loadPokemons}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Pokédex
          </h1>
          <p className="text-lg text-gray-600">
            Explore o mundo dos Pokémon da primeira geração
          </p>
          
          {/* Status da API */}
          {apiStatus && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm">
              {usingFallback ? (
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-1 rounded-full">
                  <span className="font-medium">⚠️ Modo Demonstração</span>
                  <span className="ml-2">Dados locais sendo exibidos</span>
                </div>
              ) : (
                <div className="bg-green-100 border border-green-300 text-green-800 px-3 py-1 rounded-full">
                  <span className="font-medium">✅ Conectado</span>
                  <span className="ml-2">PokeAPI Online</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Aviso sobre dados de demonstração */}
        {usingFallback && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Modo de Demonstração:</strong> Devido a problemas de conectividade com a PokeAPI, 
                  estamos exibindo dados locais. Alguns recursos podem estar limitados.
                </p>
                <button
                  onClick={loadPokemons}
                  className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                >
                  Tentar conectar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Pokémons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {pokemonList.map((pokemon, index) => (
            <SimplePokemonCard
              key={pokemon.name}
              pokemon={pokemon}
              pokemonId={index + 1}
            />
          ))}
        </div>

        {/* Footer com informações */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Pokédex criada com ❤️ • {pokemonList.length} Pokémon carregados
          </p>
          {apiStatus && (
            <p className="mt-1">
              Fonte: {usingFallback ? 'Dados Locais' : apiStatus.currentUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
