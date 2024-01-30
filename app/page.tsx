'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Pokemon {
  name: string;
  url: string;
}

interface PokeApi {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

async function fetchPokemons(url: string): Promise<PokeApi> {
  const response = await fetch(url);
  return response.json();
}

export default function Home() {
  const [pokeApi, setPokeApi] = useState<PokeApi | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const handleSearchClick = async () => {
    const pokemons = await fetchPokemons(
      'https://pokeapi.co/api/v2/pokemon/' + searchTerm.toLowerCase(),
    );

    if (pokemons && searchTerm.trim())
      router.push(`/pokemon/${searchTerm.toLowerCase()}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      const initialData = await fetchPokemons(
        'https://pokeapi.co/api/v2/pokemon',
      );
      setPokeApi(initialData);
    };

    fetchData();
  }, []);

  const handlePagination = async (url: string | null | undefined) => {
    if (url) {
      const pokemons = await fetchPokemons(url);
      setPokeApi(pokemons);
    }
  };

  return (
    <>
      <section className="container">
        <h1 className="text-4xl font-bold text-center uppercase text-red-700 py-8">
          Pokemons
        </h1>

        <div className="mb-4 flex justify-center">
          <input
            type="text"
            placeholder="Pesquisar Pokémon"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:border-red-700"
          />
          <button
            className="p-2 ml-2 bg-red-700 text-white font-bold rounded-md"
            onClick={handleSearchClick}
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap justify-center">
          {pokeApi?.results.map((pokemon) => {
            const id = pokemon.url.slice(34).replace('/', '');

            return (
              <Link key={pokemon.name} href={`/pokemon/${pokemon.name}`}>
                <div className="h-50 p-4 mx-2 my-2 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105">
                  <div className="mb-4">
                    <Image
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                      alt={pokemon.name}
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center uppercase">
                    {pokemon.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="flex justify-between py-4 px-10">
          {pokeApi?.previous && (
            <button
              className="me-auto p-2 mx-2 bg-red-700 text-white rounded font-bold transition duration-300 hover:scale-105"
              onClick={() => handlePagination(pokeApi?.previous)}
              disabled={pokeApi?.previous ? false : true}
            >
              Anterior
            </button>
          )}

          {pokeApi?.next && (
            <button
              className="ms-auto p-2 mx-2 bg-red-700 text-white rounded font-bold transition duration-300 hover:scale-105"
              onClick={() => handlePagination(pokeApi?.next)}
              disabled={pokeApi?.next ? false : true}
            >
              Próximo
            </button>
          )}
        </div>
      </section>
    </>
  );
}
