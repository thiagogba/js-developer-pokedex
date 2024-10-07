
const btnLoadMore = document.getElementById('btnLoadMore');
const btnPreviousId = document.getElementById('previous');
const btnNextId = document.getElementById('next');
const btnHome = document.getElementById('home-image');

const pokemonOl = document.getElementById('pokemonList');
const detailPage = document.getElementById('detail-page');
const detailContent = document.getElementById('detail-content');

const landPage = document.getElementById('land-page');

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

function loadPokemonDetail(pokemon) {

  detailContent.innerHTML = `
    <div class="type ${pokemon.type}">
    <img src="${pokemon.photo}" alt="${pokemon.name}">
    <h1 class="name">${pokemon.name}  <span class="number">#${('00'+pokemon.number).slice(-3)}</span></h1>
    <ol class="types">${pokemon.types
                        .map((type) => `<li class="type ${type}">${type}</li>`)
                        .join("")}
    </ol>
    <div class="pokemon-detail-footer">
    <ul class="stats-container">
      <h2>Stats</h2>
      <li class="stats">
        <p>Height</p>
        <p>${parseInt(pokemon.height) / 10} m</p>
      </li>
      <li class="stats">
        <p>Weight</p>
        <p>${parseInt(pokemon.weight) / 10} kg</p>
      </li>
      ${Object.entries(pokemon.base_stats).map(([stats]) =>
        `<li class='stats'>
          <p>${stats}</p>
          <p>${pokemon.base_stats[stats]}</p>
        </li>`
        ).join("")
      }
      
    </ul>
    </div>
    `
}

document.addEventListener("click", function(e){
  const target = e.target.closest("li");
  let p_id;
  try {
    p_id = target.querySelector('.number');
  } catch (e) {
    return;
  }

  landPage.style.display = 'none';
  detailPage.style.display = 'block';
  p_id = p_id.innerHTML.substring(1);

  loadPokemonDetail(pokeApi.getDetailsLocal(parseInt(p_id)));
});

loadPokemonItens(offset, limit);

btnHome.addEventListener('click', () => {
  landPage.style.display = 'block';
  detailPage.style.display = 'none';
})

btnPreviousId.addEventListener('click', () => {
  loadPokemonDetail(pokeApi.getDetailPrevious());
});

btnNextId.addEventListener('click', () => {
  loadPokemonDetail(pokeApi.getDetailNext());
});

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


