
const pokeApi = {};

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
