let page = 1;
let offset = 0;
let paginationDiv = document.getElementById('page_number_div');
let searchInput = document.getElementById('searchInput');
let pokedex = document.getElementById('pokedex');
let nextPageBtn = document.getElementById('next_page');
let backPageBtn = document.getElementById('back_page');
window.addEventListener('load', (event) => {
    // let generations = ['i', 'ii', 'iii', 'iV', 'v', 'vi', 'vii', 'viii'];
    paginationDiv.textContent = page;
    let pokemons = fetchPokemon(page)
    console.log('The page has fully loaded');
    initEvents()
});


const fetchPokemon = (page) => {
    let pokemons = [];
    console.log(offset, page)
    for (let i = offset; i < 5 * page; i++) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(pokemon => {

                let moves = getFourRandomMoves(pokemon),
                    cardDiv = document.createElement('div'),
                    html = createHtmlMoves(pokemon, moves);

                cardDiv.innerHTML = html;
                cardDiv.classList.add('card');
                pokedex.append(cardDiv);
                pokemon['htmlCard'] = cardDiv;
                pokemons.push(pokemon);

            })
    }
}
const initEvents = () => {
    searchInput.addEventListener('input', (e) => {
        for (let i = 0; i < pokemons.length; i++) {
            if (pokemons[i].name.indexOf(e.target.value) == -1) {
                pokemons[i].htmlCard.style.display = 'none';
            } else {
                pokemons[i].htmlCard.style.display = 'flex';
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
const createHtmlMoves = (pokemon, moves) => {
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



