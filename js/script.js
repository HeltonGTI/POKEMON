const form = document.getElementById('form');
const input = document.getElementById('pokemonInput');
const tabela = document.getElementById('tabela');
const erro = document.getElementById('erro');

let pokemons = JSON.parse(localStorage.getItem('pokemons')) || [];

/**
 * Busca Pokémon na API
 * @param {string} nome
 */
async function buscarPokemon(nome) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`);
    if (!res.ok) throw new Error('Pokémon não encontrado');

    const data = await res.json();

    const pokemon = {
      nome: data.name,
      imagem: data.sprites.front_default,
      tipo: data.types[0].type.name,
      peso: data.weight
    };

    salvarPokemon(pokemon);
    renderizar();
    erro.textContent = '';

  } catch (e) {
    erro.textContent = e.message;
  }
}

/**
 * Salva no localStorage
 * @param {object} pokemon
 */
function salvarPokemon(pokemon) {
  pokemons.push(pokemon);
  localStorage.setItem('pokemons', JSON.stringify(pokemons));
}

/**
 * Remove Pokémon
 * @param {number} index
 */
function removerPokemon(index) {
  pokemons.splice(index, 1);
  localStorage.setItem('pokemons', JSON.stringify(pokemons));
  renderizar();
}

/**
 * Renderiza tabela
 */
function renderizar() {
  tabela.innerHTML = '';

  pokemons.forEach((p, index) => {
    tabela.innerHTML += `
      <tr>
        <td>${p.nome}</td>
        <td><img src="${p.imagem}"></td>
        <td>${p.tipo}</td>
        <td>${p.peso}</td>
        <td><button onclick="removerPokemon(${index})">Excluir</button></td>
      </tr>
    `;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const valor = input.value.trim();

  if (!valor) {
    erro.textContent = 'Digite um nome!';
    return;
  }

  buscarPokemon(valor);
  input.value = '';
});

renderizar();