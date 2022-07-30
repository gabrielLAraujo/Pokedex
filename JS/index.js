let page = 1;
let offset = 0;
let paginationDiv = document.getElementById('page_number_div');
let searchInput = document.getElementById('searchInput');
let pokedex = document.getElementById('pokedex');
let nextPageBtn = document.getElementById('next_page');
let backPageBtn = document.getElementById('back_page');
let promisses = [];
let allPokemons = [];
const getUrl = id => `https://pokeapi.co/api/v2/pokemon/${id}`;
window.addEventListener('load', (event) => {
    paginationDiv.textContent = page;
    createPromisses();
    let pokemons = fetchPokemon(page)
    console.log('The page has fully loaded');
    initEvents()
});

const createPromisses = () => {
    let i = offset > 0 ? offset : 1;
    let pageCount = page == 1 ? page * 5 : page * 5 - 1
    for (i; i < pageCount; i++) {
        promisses.push(fetch(getUrl(i)).then(response => response.json()))
    }
}
const fetchPokemon = (page) => {

    Promise.all(promisses).then(pokemons => {
        pokemons.forEach(pokemon => {
            let moves = getFourRandomMoves(pokemon),
                html = createHtmlCard(pokemon, moves),
                cardDiv = createCardDiv(html, pokemon.types[0].type.name);


            pokemon['htmlCard'] = cardDiv;
            allPokemons.push(pokemon);
        })
    })
}

const createCardDiv = (html, type) => {
    let cardDiv = document.createElement('div');
    cardDiv.innerHTML = html;
    cardDiv.classList.add('card');
    cardDiv.classList.add(type);
    pokedex.append(cardDiv);
    return cardDiv;
}
const initEvents = () => {
    searchInput.addEventListener('input', (e) => {
        for (let i = 0; i < allPokemons.length; i++) {
            if (allPokemons[i].name.indexOf(e.target.value) == -1) {
                allPokemons[i].htmlCard.style.display = 'none';
            } else {
                allPokemons[i].htmlCard.style.display = 'flex';
            }
        }

    })
    nextPageBtn.addEventListener('click', (e) => {
        makePagination(true);
    })
    backPageBtn.addEventListener('click', (e) => {
        if (page - 1 > 0)
            makePagination(false)
    })
}
const makePagination = (next) => {
    if (next) {
        page += 1;
        offset += 5;
    }
    else {
        page -= 1;
        offset -= 5;
    }
    promisses = [];
    createPromisses();
    clearScreen();
    fetchPokemon(page);
    paginationDiv.textContent = page;
}
const createTypeText = (types) => {
    return types.map((el) => {
        return el.type.name
    }).join(" | ");
}
const createHtmlStats = (stats) => {
    let html = ""
    stats.forEach(el => {
        html += `<p>${el.stat.name}:  ${el.base_stat}</p>`
    });
    return html
}
const createHtmlCard = (pokemon, moves) => {
    let imageSrc = pokemon.sprites.other['official-artwork'].front_default,
        type = createTypeText(pokemon.types),
        html = '';
    html = `<div class="pokemon_name">${pokemon.name}#${pokemon.id}</div>
    <div>${type}</div>
    <div class="pokemon_img_stats">
    <div class="pokemon_img_div"><img class="pokemon_image" src="${imageSrc}" alt="${pokemon.name}"></img></div>
    <div class="pokemon_stats">${createHtmlStats(pokemon.stats)}</div>
    </div>
    <div class="pokemon_moves">
    `;
    for (let j = 0; j < moves.length; j++) {
        html += `<div class="pokemon_move">${moves[j]}</div>`
    }
    html += '</div>';
    return html
}
const getFourRandomMoves = (pokemon) => {
    let moves = []
    let size = pokemon.moves.length >= 4 ? 4 : pokemon.moves.length
    for (let i = 0; i < size; i++) {
        moves.push(pokemon.moves[i].move.name)
    }

    return moves;
}
const clearScreen = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.remove();
    });
    pokemons = [];
}



