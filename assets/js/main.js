
const btnLoadMore = document.getElementById('btnLoadMore');

const pokemonOl = document.getElementById('pokemonList');

const limit = 10;
let offset = 0;

const max_records = 150;

function loadPokemonItens(offset, limit) {
  function convertPokemonToLi(pokemon) {
    return `
      <li class="pokemon ${pokemon.type}">
        <span class="number">#${('00'+pokemon.number).slice(-3)}</span>
        <span class="name">${pokemon.name}</span>
          
        <div class="detail">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" 
            alt="${pokemon.name}">
        </div>
      </li>
      `
  };

  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemonOl.innerHTML += pokemons.map(convertPokemonToLi).join('');
  });
}


loadPokemonItens(offset, limit);

btnLoadMore.addEventListener('click', () => {
  offset += limit;
  const qtdRecords = offset + limit;

  if (qtdRecords >= max_records) {
    const newLimit = max_records - offset;
    loadPokemonItens(offset, newLimit);
    btnLoadMore.parentElement.removeChild(btnLoadMore);
    return;
  } else {
    loadPokemonItens(offset, limit);
  }
});


