import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

// URLs alternativas para PokeAPI (alguns mirrors/proxies podem funcionar melhor)
const API_URLS = [
  'https://pokeapi.co/api/v2',
  'https://pokeapi.glitch.me/v2', // Mirror alternativo
  'https://beta.pokeapi.co/api/v2', // Beta da PokeAPI
];

let currentUrlIndex = 0;
let detectedSSLIssue = false;

// Função para detectar se o erro é relacionado a SSL/TLS
function isSSLError(error: any): boolean {
  if (!error) return false;
  
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  // Lista de códigos e mensagens que indicam problemas SSL/TLS
  const sslErrorCodes = [
    'ERR_CERT_AUTHORITY_INVALID',
    'ERR_CERT_COMMON_NAME_INVALID',
    'ERR_CERT_DATE_INVALID',
    'ERR_SSL_PROTOCOL_ERROR',
    'DEPTH_ZERO_SELF_SIGNED_CERT',
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
    'CERT_HAS_EXPIRED',
    'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
    'ERR_TLS_CERT_ALTNAME_INVALID'
  ];
  
  const sslErrorMessages = [
    'certificate',
    'ssl',
    'tls',
    'self signed',
    'authority invalid',
    'cert_authority_invalid',
    'certificate verify failed'
  ];
  
  return sslErrorCodes.some(code => errorCode.includes(code)) ||
         sslErrorMessages.some(msg => errorMessage.toLowerCase().includes(msg));
}

// Função para detectar problemas de conectividade específicos
function isConnectivityError(error: any): boolean {
  if (!error) return false;
  
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  const connectivityErrors = [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ECONNRESET',
    'ETIMEDOUT',
    'ERR_NETWORK',
    'ERR_INTERNET_DISCONNECTED'
  ];
  
  return connectivityErrors.some(code => 
    errorCode.includes(code) || errorMessage.includes(code)
  );
}

// Configuração do cliente HTTP com timeout e retry
function createApiClient(baseURL: string): AxiosInstance {
  return axios.create({
    baseURL,
    timeout: 15000, // Aumentei o timeout para 15 segundos
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    },
    // Não definir User-Agent no navegador (causa problemas)
    validateStatus: (status) => status < 500,
  });
}

let apiClient = createApiClient(API_URLS[currentUrlIndex]);

// Sistema de retry com detecção de SSL e fallback de URLs
async function retryRequest<T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentativa ${attempt} usando: ${API_URLS[currentUrlIndex]}`);
      const response = await requestFn();
      
      if (response.status === 200 && response.data) {
        // Reset para primeira URL se bem-sucedido
        if (currentUrlIndex !== 0) {
          console.log('Requisição bem-sucedida, mantendo URL atual para próximas requisições');
        }
        return response.data;
      }
      
      throw new Error(`Status HTTP inválido: ${response.status}`);
      
    } catch (error: any) {
      lastError = error;
      
      console.log(`Erro na tentativa ${attempt}:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: API_URLS[currentUrlIndex]
      });
      
      // Detecta problemas SSL
      if (isSSLError(error)) {
        detectedSSLIssue = true;
        console.log('🔒 Problema SSL detectado');
      }
      
      // Se é um erro 403, pode ser rate limiting ou bloqueio
      if (error.response?.status === 403) {
        console.log('⚠️ Erro 403 detectado - possível bloqueio ou rate limiting');
        
        // Tenta próxima URL se disponível
        if (currentUrlIndex < API_URLS.length - 1) {
          currentUrlIndex++;
          apiClient = createApiClient(API_URLS[currentUrlIndex]);
          console.log(`Mudando para URL alternativa: ${API_URLS[currentUrlIndex]}`);
          continue;
        }
      }
      
      // Para erros SSL ou conectividade, tenta URLs alternativas
      if ((isSSLError(error) || isConnectivityError(error)) && 
          currentUrlIndex < API_URLS.length - 1) {
        currentUrlIndex++;
        apiClient = createApiClient(API_URLS[currentUrlIndex]);
        console.log(`Tentando URL alternativa devido a erro SSL/conectividade: ${API_URLS[currentUrlIndex]}`);
        continue;
      }
      
      // Se não é o último attempt, aguarda antes de tentar novamente
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  console.error('❌ Todas as tentativas falharam');
  
  if (detectedSSLIssue) {
    throw new Error('Problema de certificado SSL detectado. Usando dados de demonstração como fallback.');
  }
  
  if (lastError?.response?.status === 403) {
    throw new Error('Acesso negado pela PokeAPI (403). Usando dados de demonstração como fallback.');
  }
  
  if (isConnectivityError(lastError)) {
    throw new Error('Problema de conectividade com a PokeAPI. Verifique sua conexão de internet ou tente novamente mais tarde.');
  }
  
  throw new Error(`Erro ao acessar PokeAPI: ${lastError?.message || 'Erro desconhecido'}`);
}

// Função principal para buscar lista de pokémons
export async function fetchPokemonList(limit: number = 151, offset: number = 0): Promise<PokemonListResponse> {
  try {
    return await retryRequest(() => 
      apiClient.get<PokemonListResponse>(`/pokemon?limit=${limit}&offset=${offset}`)
    );
  } catch (error: any) {
    console.error('Erro na fetchPokemonList:', error.message);
    throw error;
  }
}

// Função para buscar detalhes de um pokémon específico
export async function fetchPokemonDetail(pokemonId: number): Promise<PokemonDetail> {
  try {
    return await retryRequest(() => 
      apiClient.get<PokemonDetail>(`/pokemon/${pokemonId}`)
    );
  } catch (error: any) {
    console.error(`Erro ao buscar detalhes do pokémon ${pokemonId}:`, error.message);
    throw error;
  }
}

// Função para obter status atual da API
export function getApiStatus() {
  return {
    currentUrl: API_URLS[currentUrlIndex],
    sslIssueDetected: detectedSSLIssue,
    urlIndex: currentUrlIndex,
    totalUrls: API_URLS.length
  };
}

// Função para resetar configurações da API (útil para testes)
export function resetApiClient() {
  currentUrlIndex = 0;
  detectedSSLIssue = false;
  apiClient = createApiClient(API_URLS[currentUrlIndex]);
}

export type { PokemonListResponse, PokemonDetail };
