
const pokeApi = {};
const local_pokemons = {};

last_index_req = 0;

pokeApi.getDetailsLocal = (id) => {
  let l_pokemon = new Pokemon();
  l_pokemon = local_pokemons[id];
  last_index_req = parseInt(id);

  if (!l_pokemon) {
    l_pokemon = Object.values(local_pokemons)[0];
    last_index_req = Object.keys(local_pokemons)[0];
  }

  return l_pokemon;
}

pokeApi.getDetailNext = () => {
  let next_id = parseInt(last_index_req) + 1;

  if (!local_pokemons[next_id]) {
    next_idx = Object.keys(local_pokemons)[0];
  }

  return pokeApi.getDetailsLocal(next_id);
}

pokeApi.getDetailPrevious = () => {
  let previous_id = parseInt(last_index_req) - 1;

  if (!local_pokemons[previous_id]) {
    const prev_idx = Object.keys(local_pokemons).length - 1;
    previous_id = Object.keys(local_pokemons)[prev_idx];
  }

  return pokeApi.getDetailsLocal(previous_id);
}

function convertPokeApiDetailToPokemon(pokeDetail) {
  const pokemon = new Pokemon();
  pokemon.number = pokeDetail.id;
  pokemon.name = pokeDetail.name;

  pokemon.types = pokeDetail.types.map(typeSlot => typeSlot.type.name);
  [pokemon.type] = pokemon.types;
  pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;
  
  pokemon.height = pokeDetail.height;
  pokemon.weight = pokeDetail.weight;
  pokemon.abilities = pokeDetail.abilities.map(abilitySlot => abilitySlot.ability.name);
  
  pokeDetail.stats.forEach(element => {
    pokemon.base_stats[element.stat.name] = element.base_stat
  });

  local_pokemons[pokemon.number] = pokemon;

  return pokemon;
}

pokeApi.getPokemonDetails = (pokemon) => {
  return fetch(pokemon.url)
          .then(response => response.json())
          .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemons = (offset = 0, limit = 10) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  return fetch(url)
          .then(response => response.json())
          .then(jsonBody => jsonBody.results)
          .then(pokemons => pokemons.map(pokeApi.getPokemonDetails))
          .then(pokemonPromises => Promise.all(pokemonPromises))
          .then(pokemonDetails => pokemonDetails)
          .catch(err => console.error(err));
}
