import Image from "next/image";

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

async function fetchPokemon(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  return await res.json();
}

export default async function Pokemon({ params }: PokemonProps) {
  const pokemon = await fetchPokemon(params.name);

  const { name, height, weight, types, stats, moves, sprites } = pokemon;

  return (
    <main className="bg-background h-screen w-screen flex items-center justify-center">
      <div className="bg-primary-foreground p-4 border-secondary">
        <h1 className="text-primary font-semibold text-2xl capitalize">
          {name}
        </h1>
        <Image
          src={sprites.other["official-artwork"].front_default}
          width={250}
          height={250}
          alt={name}
          priority
        />
      </div>
    </main>
  );
}
