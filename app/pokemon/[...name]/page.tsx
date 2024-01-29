import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface PokemonProps {
  params: {
    name: string;
  };
}

interface types {
  type: {
    name: string;
  };
}

interface stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface move {
  move: {
    name: string;
  };
}

interface sprite {
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: types[];
  stats: stat[];
  moves: move[];
  sprites: sprite;
}

async function fetchPokemon(name: string): Promise<Pokemon | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!res.ok) {
    return null;
  }

  return await res.json();
}

export default async function Pokemon({ params }: PokemonProps) {
  const pokemon = (await fetchPokemon(params.name)) ?? null;

  return (
    <main className="bg-background min-h-screen min-w-screen flex items-center justify-center bg-slate-100">
      {pokemon ? (
        <div className="bg-primary-foreground border-slate-600  sm:p-10 p-4 rounded-lg border-2 b-5 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h1 className="text-primary font-semibold text-2xl capitalize mb-2">
              {pokemon.name}
            </h1>

            <div>
              <h2 className="inline  font-semibold text-red-800">Type: </h2>
              {pokemon.types.map((type, index) => (
                <p key={index} className="inline capitalize font-medium">
                  {type.type.name}
                </p>
              ))}
            </div>
          </div>

          <Image
            className="border-2"
            src={pokemon.sprites.other["official-artwork"].front_default}
            width={pokemon.height * 20}
            height={pokemon.height * 20}
            alt={pokemon.name}
            priority
          />

          <div className="flex gap-4 divide-x-2">
            <div>
              <p className="font-semibold text-red-800 inline">Height: </p>
              <p className="font-medium inline">{pokemon.height}</p>
            </div>
            <div>
              <p className="font-semibold text-red-800 inline ml-4">Weight: </p>
              <p className="font-medium inline">{pokemon.weight}</p>
            </div>
          </div>

          <div className="flex gap-8 items-start justify-center w-[100%]">
            <div className="">
              <h2 className="font-semibold text-red-800">Status:</h2>
              {pokemon.stats.map((stat, index) => (
                <div key={index}>
                  <p className="inline capitalize font-medium">
                    {stat.stat.name}:
                  </p>
                  <p className="inline"> {stat.base_stat}</p>
                </div>
              ))}
            </div>

            <div className="">
              <h2 className="font-semibold text-red-800">Moves:</h2>
              {pokemon.moves.slice(0, 6).map((move, index) => (
                <p key={index} className="capitalize font-medium">
                  {move.move.name}
                </p>
              ))}
            </div>
          </div>
          <Button>
            <Link href="/">Go Back</Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 flex-col">
          <h1 className="font-bold text-2xl">Pokémon not found.</h1>
          <Button>
            <Link href="/">Go Back</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
